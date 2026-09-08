import { env } from "../config/index.js";
import { logger } from "../config/logger.js";
import { ExternalServiceError } from "../shared/app-error.js";
import { OrderModel, getShiprocketSettings } from "../models/index.js";
import crypto from "crypto";

const SHIPROCKET_BASE_URL = "https://apiv2.shiprocket.in/v1/external";

let tokenCache = {
  token: null,
  expiresAt: 0
};

/**
 * Get Shiprocket token from settings (with env fallback)
 */
async function getShiprocketCredentials() {
  const { SettingsModel } = await import("../models/index.js");
  let dbSettings = null;
  try {
    const settingsDoc = await SettingsModel.findById("global_settings")
      .select("+shiprocket.credentials.password +shiprocket.credentials.webhookSecret")
      .lean();
    if (settingsDoc?.shiprocket) {
      dbSettings = settingsDoc.shiprocket;
    }
  } catch (e) {
    logger.warn({ error: e.message }, "Could not load Shiprocket credentials from settings DB");
  }

  const settings = dbSettings || (await getShiprocketSettings());
  
  return {
    email: settings.credentials?.email || env.SHIPROCKET_EMAIL,
    password: settings.credentials?.password || env.SHIPROCKET_PASSWORD,
    webhookSecret: settings.credentials?.webhookSecret || env.SHIPROCKET_WEBHOOK_SECRET
  };
}

/**
 * Get valid Shiprocket auth token, refreshing if needed
 */
async function getShiprocketToken() {
  const now = Date.now();
  
  // Return cached token if still valid (with 5 min buffer)
  if (tokenCache.token && tokenCache.expiresAt > now + 300000) {
    return tokenCache.token;
  }

  try {
    const credentials = await getShiprocketCredentials();
    console.log("[Shiprocket] Authenticating with email:", credentials.email || "(empty email)");
    
    const response = await fetch(`${SHIPROCKET_BASE_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: credentials.email,
        password: credentials.password
      })
    });

    const data = await response.json();

    if (!response.ok || !data.token) {
      console.error("[Shiprocket Auth Error] Status:", response.status, "Response:", JSON.stringify(data, null, 2));
      throw new ExternalServiceError(
        data.message || "Failed to authenticate with Shiprocket",
        "SHIPROCKET",
        data
      );
    }

    // Token expires in ~10 days, cache with 1 hour buffer
    tokenCache = {
      token: data.token,
      expiresAt: now + (9 * 24 * 60 * 60 * 1000) // 9 days
    };

    console.log("[Shiprocket] Token acquired successfully.");
    logger.info("Shiprocket token refreshed successfully");
    return data.token;
  } catch (error) {
    console.error("[Shiprocket Auth Exception]:", error.message);
    if (error instanceof ExternalServiceError) throw error;
    logger.error({ error }, "Error getting Shiprocket token");
    throw new ExternalServiceError("Shiprocket authentication failed", "SHIPROCKET", error);
  }
}

/**
 * Make authenticated request to Shiprocket API
 */
async function shiprocketRequest(endpoint, options = {}) {
  const token = await getShiprocketToken();
  
  console.log(`[Shiprocket Request] ${options.method || "GET"} ${SHIPROCKET_BASE_URL}${endpoint}`);
  
  const response = await fetch(`${SHIPROCKET_BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`,
      ...options.headers
    }
  });

  const data = await response.json();

  if (!response.ok) {
    console.error(`[Shiprocket API Error] ${endpoint} Status: ${response.status}`, JSON.stringify(data, null, 2));
    logger.error({ endpoint, status: response.status, data }, "Shiprocket API error");
    throw new ExternalServiceError(
      data.message || (typeof data === "object" ? JSON.stringify(data) : "Shiprocket API request failed"),
      "SHIPROCKET",
      { status: response.status, data }
    );
  }

  console.log(`[Shiprocket Response Success] ${endpoint}:`, JSON.stringify(data, null, 2));
  return data;
}

/**
 * Create Shiprocket order (adhoc) using settings
 */
export async function createShiprocketOrder(order) {
  const shippingAddress = order.shippingAddress || {};
  const billingAddress = order.billingAddress || shippingAddress;

  // Resolve customer details if not populated
  let customer = order.customer;
  if (customer && (!customer.email || !customer.phone)) {
    try {
      const { CustomerModel } = await import("../models/index.js");
      const customerDoc = await CustomerModel.findById(customer._id || customer).lean();
      if (customerDoc) {
        customer = customerDoc;
      }
    } catch (e) {
      logger.warn({ error: e.message }, "Could not populate customer for Shiprocket order");
    }
  }

  // Extract recipient name
  const rawName = (billingAddress.recipientName || shippingAddress.recipientName || customer?.name || "Customer").trim();
  const nameParts = rawName.split(/\s+/);
  const firstName = nameParts[0] || "Customer";
  const lastName = nameParts.slice(1).join(" ") || "";

  // Extract phone (Shiprocket requires a valid phone number)
  let rawPhone = order.phone || shippingAddress.phone || billingAddress.phone || customer?.phone || "";
  let cleanPhone = String(rawPhone).replace(/\D/g, "");
  if (cleanPhone.length > 10 && cleanPhone.startsWith("91")) {
    cleanPhone = cleanPhone.slice(2);
  }
  if (!cleanPhone || cleanPhone.length < 10) {
    cleanPhone = "9999999999";
  }

  // Extract email
  const customerEmail =
    order.email ||
    customer?.email ||
    shippingAddress.email ||
    billingAddress.email ||
    "order@urbanlayers.com";

  // Build items array
  const items = (order.items || []).map(item => ({
    name: item.name || "Item",
    sku: item.sku || `SKU-${item.productId || "1"}`,
    units: Math.max(item.quantity || 1, 1),
    selling_price: Math.max((item.unitPrice || 0) / 100, 0),
    discount: 0,
    tax: item.taxAmount ? (item.taxAmount / (item.quantity || 1)) / 100 : 0,
    hsn: 999999
  }));

  // Get Shiprocket settings for universal default pickup location and dimensions
  const settings = await getShiprocketSettings();
  const defaultDims = settings.defaultPackageDimensions || {};
  const universalPickupLocation = settings.pickupLocation || env.SHIPROCKET_PICKUP_LOCATION || "Work";

  // Check for custom pickup location on products in order, fallback to universal
  let resolvedPickupLocation = order.pickupLocation || "";
  if (!resolvedPickupLocation && order.items && order.items.length > 0) {
    for (const item of order.items) {
      if (item.pickupLocation && item.pickupLocation.trim()) {
        resolvedPickupLocation = item.pickupLocation.trim();
        break;
      }
    }

    if (!resolvedPickupLocation) {
      try {
        const { ProductModel } = await import("../models/index.js");
        const productIds = order.items.map(i => i.productId).filter(Boolean);
        if (productIds.length > 0) {
          const products = await ProductModel.find({ _id: { $in: productIds } }).select("pickupLocation").lean();
          const productWithCustomPickup = products.find(p => p.pickupLocation && p.pickupLocation.trim() !== "");
          if (productWithCustomPickup) {
            resolvedPickupLocation = productWithCustomPickup.pickupLocation.trim();
          }
        }
      } catch (err) {
        logger.warn({ error: err.message }, "Could not query product custom pickup location");
      }
    }
  }

  if (!resolvedPickupLocation || resolvedPickupLocation === "Primary") {
    resolvedPickupLocation = universalPickupLocation || "Work";
  }

  const orderDate = order.createdAt
    ? new Date(order.createdAt).toISOString().split("T")[0]
    : new Date().toISOString().split("T")[0];

  const payload = {
    order_id: order.orderNumber,
    order_date: orderDate,
    pickup_location: resolvedPickupLocation,
    comment: `Order ${order.orderNumber} - ${firstName} ${lastName}`.trim(),
    billing_customer_name: firstName,
    billing_last_name: lastName || firstName,
    billing_address: billingAddress.line1 || shippingAddress.line1 || "Street Address",
    billing_address_2: billingAddress.line2 || shippingAddress.line2 || "",
    billing_city: billingAddress.city || shippingAddress.city || "City",
    billing_pincode: String(billingAddress.postalCode || shippingAddress.postalCode || "110001"),
    billing_state: billingAddress.state || shippingAddress.state || "State",
    billing_country: billingAddress.country || shippingAddress.country || "India",
    billing_email: customerEmail,
    billing_phone: cleanPhone,
    shipping_is_billing: true,
    order_items: items,
    payment_method: order.paymentMethod === "COD" ? "COD" : "Prepaid",
    sub_total: (order.subtotal || order.totalAmount || 0) / 100,
    length: Number(order.packageDimensions?.length || defaultDims.length || 10),
    breadth: Number(order.packageDimensions?.breadth || defaultDims.breadth || 15),
    height: Number(order.packageDimensions?.height || defaultDims.height || 20),
    weight: Number(order.packageWeight || defaultDims.weight || 0.5)
  };

  console.log(`[Shiprocket Creating Order #${order.orderNumber}] Payload:`, JSON.stringify(payload, null, 2));

  return shiprocketRequest("/orders/create/adhoc", {
    method: "POST",
    body: JSON.stringify(payload)
  });
}

/**
 * Create shipment and assign AWB
 */
export async function createShiprocketShipment(shiprocketOrderId, order) {
  const payload = { order_id: shiprocketOrderId };
  return shiprocketRequest("/courier/assign/awb", {
    method: "POST",
    body: JSON.stringify(payload)
  });
}

/**
 * Get tracking details from Shiprocket
 */
export async function getShiprocketTracking(awb) {
  return shiprocketRequest(`/courier/track/awb/${awb}`, { method: "GET" });
}

/**
 * Generate shipping label PDF
 */
export async function generateShiprocketLabel(shipmentId) {
  return shiprocketRequest(`/courier/generate/label`, {
    method: "POST",
    body: JSON.stringify({ shipment_id: shipmentId })
  });
}

/**
 * Generate invoice PDF
 */
export async function generateShiprocketInvoice(shipmentId) {
  return shiprocketRequest(`/orders/invoice`, {
    method: "POST",
    body: JSON.stringify({ shipment_id: shipmentId })
  });
}

/**
 * Process Shiprocket webhook tracking data
 */
export async function processShiprocketTrackingWebhook(webhookData) {
  try {
    const { shipment_id, awb_code, current_status, status_code, tracking_url, tracking_data, updated_at } = webhookData;

    // Find order by shiprocket shipment ID or AWB
    const { OrderModel } = await import("../models/index.js");
    const order = await OrderModel.findOne({
      $or: [
        { "shipping.shiprocketShipmentId": shipment_id },
        { "shipping.awb": awb_code },
        { "returnShipment.shiprocketShipmentId": shipment_id },
        { "returnShipment.awb": awb_code }
      ]
    });

    if (!order) {
      logger.warn({ shipment_id, awb_code }, "Order not found for Shiprocket webhook");
      return { success: false, message: "Order not found" };
    }

    // Build a deterministic eventKey from stable provider fields.
    // This ensures the same scan event never creates duplicate tracking records,
    // even if the webhook fires more than once.
    const activity = tracking_data?.activity || current_status || "";
    const location = tracking_data?.location || "";
    const scanDate = updated_at || "";
    const rawEventKey = `${awb_code}|${scanDate}|${status_code}|${activity}|${location}`;
    const eventKey = crypto.createHash("sha256").update(rawEventKey).digest("hex").slice(0, 32);

    // Determine if this is a return shipment
    const isReturn = order.returnShipment?.awb === awb_code || order.returnShipment?.shiprocketShipmentId === shipment_id;

    const existingEvents = isReturn ? (order.returnTrackingEvents || []) : (order.trackingEvents || []);
    if (existingEvents.some(e => e.eventKey === eventKey)) {
      logger.info({ orderId: order._id, eventKey }, "Duplicate Shiprocket tracking event ignored (idempotent).");
      return { success: true, orderId: order._id, duplicate: true };
    }

    // CRITICAL: occurredAt must come from the provider scan date, not from current time.
    const trackingEvent = {
      eventKey,
      provider: "SHIPROCKET",
      status: current_status,
      statusLabel: current_status,
      activity,
      location,
      providerStatusCode: String(status_code || ""),
      rawStatus: current_status,
      // occurredAt is set from the provider scan date — NEVER from Date.now() or order.updatedAt
      occurredAt: scanDate ? new Date(scanDate) : new Date()
    };

    if (isReturn) {
      order.returnTrackingEvents = order.returnTrackingEvents || [];
      order.returnTrackingEvents.push(trackingEvent);
      order.returnShipment = {
        ...order.returnShipment,
        awb: awb_code,
        courier: webhookData.courier_name || order.returnShipment?.courier,
        status: current_status,
        trackingUrl: tracking_url,
        lastUpdate: new Date(updated_at || Date.now())
      };
    } else {
      order.trackingEvents = order.trackingEvents || [];
      order.trackingEvents.push(trackingEvent);
      order.shipping = {
        ...order.shipping,
        awb: awb_code,
        carrier: webhookData.courier_name || order.shipping?.carrier,
        currentStatus: current_status,
        currentStatusId: status_code,
        shipmentStatus: webhookData.shipment_status,
        trackingUrl: tracking_url,
        shiprocketTrackingUrl: tracking_url,
        lastUpdate: new Date(updated_at || Date.now())
      };
    }

    await order.save();

    logger.info({ orderId: order._id, awb: awb_code, eventKey }, "Shiprocket webhook processed successfully");
    return { success: true, orderId: order._id };
  } catch (error) {
    logger.error({ error, webhookData }, "Error processing Shiprocket webhook");
    throw error;
  }
}

/**
 * Refresh order tracking from Shiprocket
 */
export async function refreshOrderTracking(orderId) {
  const { OrderModel } = await import("../models/index.js");
  const order = await OrderModel.findById(orderId);

  if (!order) {
    throw new (await import("../shared/app-error.js")).AppError("Order not found", 404);
  }

  const results = [];

  // Refresh forward shipment tracking
  if (order.shipping?.awb) {
    try {
      const trackingData = await getShiprocketTracking(order.shipping.awb);
      
      // Process the tracking data similar to webhook
      const webhookData = {
        shipment_id: order.shipping.shiprocketShipmentId,
        awb_code: order.shipping.awb,
        current_status: trackingData.tracking_data?.[0]?.status || trackingData.current_status,
        status_code: trackingData.tracking_data?.[0]?.status_code,
        tracking_url: trackingData.tracking_url,
        tracking_data: trackingData.tracking_data?.[0],
        updated_at: trackingData.tracking_data?.[0]?.date,
        courier_name: trackingData.courier_name
      };

      await processShiprocketTrackingWebhook(webhookData);
      results.push({ type: "forward", success: true });
    } catch (error) {
      logger.error({ error, orderId, awb: order.shipping.awb }, "Failed to refresh forward tracking");
      results.push({ type: "forward", success: false, error: error.message });
    }
  }

  // Refresh return shipment tracking
  if (order.returnShipment?.awb) {
    try {
      const trackingData = await getShiprocketTracking(order.returnShipment.awb);
      
      const webhookData = {
        shipment_id: order.returnShipment.shiprocketShipmentId,
        awb_code: order.returnShipment.awb,
        current_status: trackingData.tracking_data?.[0]?.status || trackingData.current_status,
        status_code: trackingData.tracking_data?.[0]?.status_code,
        tracking_url: trackingData.tracking_url,
        tracking_data: trackingData.tracking_data?.[0],
        updated_at: trackingData.tracking_data?.[0]?.date,
        courier_name: trackingData.courier_name
      };

      await processShiprocketTrackingWebhook(webhookData);
      results.push({ type: "return", success: true });
    } catch (error) {
      logger.error({ error, orderId, awb: order.returnShipment.awb }, "Failed to refresh return tracking");
      results.push({ type: "return", success: false, error: error.message });
    }
  }

  return { orderId, results };
}

export { getShiprocketToken };