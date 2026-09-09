import express from "express";
import { authenticate } from "../middlewares/authenticate.middleware.js";
import { authorize } from "../middlewares/authorize.middleware.js";
import { validate } from "../middlewares/validate.middleware.js";
import {
  shiprocketWebhookHandler,
  createShiprocketOrderHandler,
  createShiprocketShipmentHandler,
  getTrackingHandler,
  generateLabelHandler,
  generateInvoiceHandler,
  refreshTrackingHandler,
  getCustomerTrackingHandler,
  getAdminTrackingHandler
} from "../controllers/shiprocket.controller.js";

const router = express.Router();

/**
 * Public webhook endpoint - no auth required
 * POST /api/webhooks/shiprocket
 */
router.post("/webhooks/ship", shiprocketWebhookHandler);

/**
 * Admin Shiprocket order management routes - require admin auth
 * POST /api/admin/shiprocket/create-order
 * POST /api/admin/shiprocket/create-shipment
 * GET /api/admin/shiprocket/track/:awb
 * POST /api/admin/shiprocket/generate-label
 * POST /api/admin/shiprocket/generate-invoice
 */
router.post(
  "/admin/shiprocket/create-order",
  authenticate("admin"),
  authorize("Admin", "SuperAdmin", "Staff"),
  createShiprocketOrderHandler
);

router.post(
  "/admin/shiprocket/create-shipment",
  authenticate("admin"),
  authorize("Admin", "SuperAdmin", "Staff"),
  createShiprocketShipmentHandler
);

router.get(
  "/admin/shiprocket/track/:awb",
  authenticate("admin"),
  authorize("Admin", "SuperAdmin", "Staff"),
  getTrackingHandler
);

router.post(
  "/admin/shiprocket/generate-label",
  authenticate("admin"),
  authorize("Admin", "SuperAdmin", "Staff"),
  generateLabelHandler
);

router.post(
  "/admin/shiprocket/generate-invoice",
  authenticate("admin"),
  authorize("Admin", "SuperAdmin", "Staff"),
  generateInvoiceHandler
);

/**
 * Customer tracking routes - require customer auth
 * GET /api/customer/orders/:id/tracking
 */
router.get(
  "/customer/orders/:id/tracking",
  authenticate("customer"),
  authorize("Customer"),
  getCustomerTrackingHandler
);

/**
 * Admin tracking routes - require admin auth
 * GET /api/admin/orders/:id/tracking
 * POST /api/admin/orders/:id/refresh-tracking
 */
router.get(
  "/admin/orders/:id/tracking",
  authenticate("admin"),
  authorize("Admin", "SuperAdmin", "Staff"),
  getAdminTrackingHandler
);

router.post(
  "/admin/orders/:id/refresh-tracking",
  authenticate("admin"),
  authorize("Admin", "SuperAdmin", "Staff"),
  refreshTrackingHandler
);

export default router;