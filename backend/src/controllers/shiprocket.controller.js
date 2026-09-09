import { sendSuccess } from "../shared/api-response.js";
import {
  processShiprocketTrackingWebhook,
  refreshOrderTracking,
  createShiprocketOrder,
  createShiprocketShipment,
  getShiprocketTracking,
  generateShiprocketLabel,
  generateShiprocketInvoice
} from "../services/shiprocket.service.js";
import { AppError } from "../shared/app-error.js";
import { OrderModel } from "../models/index.js";

/**
 * Tracking webhook handler
 * POST /api/webhooks/tracking
 * Validates webhook using x-api-key header
 */
const shiprocketWebhookHandler = async (req, res, next) => {
  try {
    const webhookSecret =
      req.headers["x-api-key"] ||
      req.headers["x-shiprocket-signature"] ||
      req.headers["shiprocket-webhook-secret"];

    const { SettingsModel } = await import("../models/index.js");
    let configuredSecret = process.env.SHIPROCKET_WEBHOOK_SECRET;
    try {
      const settingsDoc = await SettingsModel.findById("global_settings")
        .select("+shiprocket.credentials.webhookSecret")
        .lean();
      if (settingsDoc?.shiprocket?.credentials?.webhookSecret) {
        configuredSecret = settingsDoc.shiprocket.credentials.webhookSecret;
      }
    } catch {
      // fallback to process.env
    }

    if (!configuredSecret) {
      throw new AppError(
        "Tracking webhook secret is not configured",
        500
      );
    }

    if (!webhookSecret || webhookSecret !== configuredSecret) {
      return res.status(401).json({
        status: "error",
        message: "Invalid webhook signature"
      });
    }

    const result = await processShiprocketTrackingWebhook(req.body);

    return res.status(200).json({
      status: "ok",
      data: result
    });
  } catch (error) {
    if (error instanceof AppError) {
      return next(error);
    }

    return res.status(200).json({
      status: "error",
      message: error.message
    });
  }
};

/**
 * Create Shiprocket order (adhoc) for an existing order
 * POST /api/admin/shiprocket/create-order
 * Body: { orderId }
 */
const createShiprocketOrderHandler = async (req, res, next) => {
  try {
    const { orderId } = req.body;

    if (!orderId) {
      throw new AppError("Order ID is required", 400);
    }

    const order = await OrderModel.findById(orderId).populate("customer");

    if (!order) {
      throw new AppError("Order not found", 404);
    }

    // Check if order is in a state that allows Shiprocket order creation
    if (!["Confirmed", "Packed"].includes(order.status)) {
      throw new AppError(
        `Cannot create Shiprocket order for order in ${order.status} status. Order must be Confirmed or Packed.`,
        400
      );
    }

    // Check if Shiprocket order already exists
    if (
      order.shipping?.shiprocketOrderId ||
      order.shipping?.shiprocketShipmentId
    ) {
      throw new AppError(
        "Shiprocket order already exists for this order",
        409
      );
    }

    const response = await createShiprocketOrder(order);

    const shiprocketOrderId = response.order_id;
    const shipmentId = response.shipment_id || null;

    if (!shiprocketOrderId) {
      throw new AppError("Shiprocket did not return order_id.", 502);
    }

    // Update order with Shiprocket details
    await OrderModel.findByIdAndUpdate(orderId, {
      $set: {
        shippingStatus: "Label Created",
        "shipping.shiprocketOrderId": shiprocketOrderId,
        "shipping.shiprocketShipmentId": shipmentId,
        "shipping.shiprocketReferenceOrderId": order.shipping?.shiprocketReferenceOrderId || order.orderNumber,
        "shipping.shiprocketAwbCode": order.shipping?.shiprocketAwbCode || null,
        "shipping.shiprocketTrackingUrl": order.shipping?.shiprocketTrackingUrl || null
      }
    });

    return sendSuccess({
      res,
      message: "Shiprocket order created successfully",
      data: {
        shiprocketOrderId,
        shipmentId,
        orderNumber: order.orderNumber
      }
    });
  } catch (error) {
    return next(error);
  }
};

/**
 * Create Shiprocket shipment and assign AWB
 * POST /api/admin/shiprocket/create-shipment
 * Body: { orderId }
 */
const createShiprocketShipmentHandler = async (req, res, next) => {
  try {
    const { orderId } = req.body;

    if (!orderId) {
      throw new AppError("Order ID is required", 400);
    }

    const order = await OrderModel.findById(orderId);

    if (!order) {
      throw new AppError("Order not found", 404);
    }

    if (!order.shipping?.shiprocketOrderId) {
      throw new AppError(
        "Shiprocket order not created yet. Create Shiprocket order first.",
        400
      );
    }

    const response = await createShiprocketShipment(
      order.shipping.shiprocketOrderId,
      order
    );

    // Update order with AWB details
    await OrderModel.findByIdAndUpdate(orderId, {
      shipping: {
        ...order.shipping,
        shiprocketAwbCode: response.awb_code,
        shiprocketTrackingUrl: response.tracking_url,
        awb: response.awb_code,
        awbAssignedDate: new Date()
      }
    });

    return sendSuccess({
      res,
      message: "Shipment created and AWB assigned successfully",
      data: {
        awbCode: response.awb_code,
        shipmentId: response.shipment_id,
        trackingUrl: response.tracking_url,
        courier: response.courier_name
      }
    });
  } catch (error) {
    return next(error);
  }
};

/**
 * Get tracking details from Shiprocket
 * GET /api/admin/shiprocket/track/:awb
 */
const getTrackingHandler = async (req, res, next) => {
  try {
    const { awb } = req.params;

    if (!awb) {
      throw new AppError("AWB code is required", 400);
    }

    const trackingData = await getShiprocketTracking(awb);

    return sendSuccess({
      res,
      message: "Tracking fetched successfully",
      data: trackingData
    });
  } catch (error) {
    return next(error);
  }
};

/**
 * Generate shipping label PDF
 * POST /api/admin/shiprocket/generate-label
 * Body: { orderId }
 */
const generateLabelHandler = async (req, res, next) => {
  try {
    const { orderId } = req.body;

    if (!orderId) {
      throw new AppError("Order ID is required", 400);
    }

    const order = await OrderModel.findById(orderId);

    if (!order) {
      throw new AppError("Order not found", 404);
    }

    const shipmentId = order.shipping?.shiprocketShipmentId;

    if (!shipmentId) {
      throw new AppError(
        "Shipment not created yet. Create shipment first.",
        400
      );
    }

    const response = await generateShiprocketLabel(shipmentId);

    // Update order with label URL
    await OrderModel.findByIdAndUpdate(orderId, {
      shipping: {
        ...order.shipping,
        labelUrl: response.label_url
      }
    });

    return sendSuccess({
      res,
      message: "Label generated successfully",
      data: {
        labelUrl: response.label_url,
        shipmentId
      }
    });
  } catch (error) {
    return next(error);
  }
};

/**
 * Generate invoice PDF
 * POST /api/admin/shiprocket/generate-invoice
 * Body: { orderId }
 */
const generateInvoiceHandler = async (req, res, next) => {
  try {
    const { orderId } = req.body;

    if (!orderId) {
      throw new AppError("Order ID is required", 400);
    }

    const order = await OrderModel.findById(orderId);

    if (!order) {
      throw new AppError("Order not found", 404);
    }

    const shipmentId = order.shipping?.shiprocketShipmentId;

    if (!shipmentId) {
      throw new AppError(
        "Shipment not created yet. Create shipment first.",
        400
      );
    }

    const response = await generateShiprocketInvoice(shipmentId);

    // Update order with invoice URL
    await OrderModel.findByIdAndUpdate(orderId, {
      shipping: {
        ...order.shipping,
        invoiceUrl: response.invoice_url
      }
    });

    return sendSuccess({
      res,
      message: "Invoice generated successfully",
      data: {
        invoiceUrl: response.invoice_url,
        shipmentId
      }
    });
  } catch (error) {
    return next(error);
  }
};

/**
 * Admin endpoint to manually refresh tracking for an order
 * POST /api/admin/orders/:id/refresh-tracking
 */
const refreshTrackingHandler = async (req, res, next) => {
  try {
    const result = await refreshOrderTracking(req.params.id);

    return sendSuccess({
      res,
      message: "Tracking refreshed successfully",
      data: result
    });
  } catch (error) {
    return next(error);
  }
};

/**
 * Customer endpoint to get tracking details for their order
 * GET /api/customer/orders/:id/tracking
 */
const getCustomerTrackingHandler = async (req, res, next) => {
  try {
    const order = await OrderModel.findById(req.params.id);

    if (!order) {
      throw new AppError("Order not found", 404);
    }

    // Secure ownership check without requiring populated customer
    if (order.customer?.toString() !== req.user.id) {
      throw new AppError("Order not found", 404);
    }

    const trackingEvents = order.trackingEvents || [];
    const returnTrackingEvents = order.returnTrackingEvents || [];
    const shipping = order.shipping || {};
    const returnShipment = order.returnShipment || {};

    return sendSuccess({
      res,
      message: "Tracking fetched successfully",
      data: {
        awb: shipping.awb,
        courier: shipping.carrier,
        currentStatus: shipping.currentStatus,
        currentStatusId: shipping.currentStatusId,
        shipmentStatus: shipping.shipmentStatus,
        shipmentStatusId: shipping.shipmentStatusId,
        etd: shipping.etd,
        awbAssignedDate: shipping.awbAssignedDate,
        pickupScheduledDate: shipping.pickupScheduledDate,
        trackingUrl: shipping.shiprocketTrackingUrl,

        trackingEvents: trackingEvents.map((e) => ({
          eventKey: e.eventKey,
          status: e.status,
          statusLabel: e.statusLabel,
          activity: e.activity,
          location: e.location,
          occurredAt: e.occurredAt,
          metadata: e.metadata
        })),

        returnShipment: returnShipment.awb
          ? {
              awb: returnShipment.awb,
              courier: returnShipment.courier,
              status: returnShipment.status,
              trackingUrl: returnShipment.trackingUrl,
              lastUpdate: returnShipment.lastUpdate,

              trackingEvents: returnTrackingEvents.map((e) => ({
                eventKey: e.eventKey,
                status: e.status,
                statusLabel: e.statusLabel,
                activity: e.activity,
                location: e.location,
                occurredAt: e.occurredAt,
                metadata: e.metadata
              }))
            }
          : null
      }
    });
  } catch (error) {
    return next(error);
  }
};

/**
 * Admin endpoint to get complete tracking details for an order
 * GET /api/admin/orders/:id/tracking
 */
const getAdminTrackingHandler = async (req, res, next) => {
  try {
    const order = await OrderModel.findById(req.params.id).populate(
      "customer"
    );

    if (!order) {
      throw new AppError("Order not found", 404);
    }

    const trackingEvents = order.trackingEvents || [];
    const returnTrackingEvents = order.returnTrackingEvents || [];
    const shipping = order.shipping || {};
    const returnShipment = order.returnShipment || {};

    return sendSuccess({
      res,
      message: "Tracking fetched successfully",
      data: {
        shiprocketOrderId: shipping.shiprocketOrderId,
        shiprocketShipmentId: shipping.shiprocketShipmentId,
        shiprocketAwbCode: shipping.shiprocketAwbCode,
        shiprocketTrackingUrl: shipping.shiprocketTrackingUrl,

        awb: shipping.awb,
        courier: shipping.carrier,
        currentStatus: shipping.currentStatus,
        currentStatusId: shipping.currentStatusId,
        shipmentStatus: shipping.shipmentStatus,
        shipmentStatusId: shipping.shipmentStatusId,
        etd: shipping.etd,
        awbAssignedDate: shipping.awbAssignedDate,
        pickupScheduledDate: shipping.pickupScheduledDate,
        podStatus: shipping.podStatus,
        pod: shipping.pod,
        qcImage: shipping.qcImage,
        qcFailureReason: shipping.qcFailureReason,

        trackingEvents: trackingEvents.map((e) => ({
          eventKey: e.eventKey,
          provider: e.provider,
          status: e.status,
          statusLabel: e.statusLabel,
          activity: e.activity,
          location: e.location,
          occurredAt: e.occurredAt,
          metadata: e.metadata,
          isReturn: e.isReturn
        })),

        returnShipment: returnShipment.awb
          ? {
              awb: returnShipment.awb,
              courier: returnShipment.courier,
              shiprocketOrderId:
                returnShipment.shiprocketOrderId,
              status: returnShipment.status,
              trackingUrl: returnShipment.trackingUrl,
              lastUpdate: returnShipment.lastUpdate,

              trackingEvents: returnTrackingEvents.map((e) => ({
                eventKey: e.eventKey,
                provider: e.provider,
                status: e.status,
                statusLabel: e.statusLabel,
                activity: e.activity,
                location: e.location,
                occurredAt: e.occurredAt,
                metadata: e.metadata,
                isReturn: e.isReturn
              }))
            }
          : null
      }
    });
  } catch (error) {
    return next(error);
  }
};

export {
  shiprocketWebhookHandler,
  createShiprocketOrderHandler,
  createShiprocketShipmentHandler,
  getTrackingHandler,
  generateLabelHandler,
  generateInvoiceHandler,
  refreshTrackingHandler,
  getCustomerTrackingHandler,
  getAdminTrackingHandler
};