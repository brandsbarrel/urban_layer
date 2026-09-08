import { OrderModel } from "../models/index.js";
import { refreshOrderTracking } from "../services/shiprocket.service.js";
import { logger } from "../config/logger.js";

/**
 * Tracking Sync Job
 * 
 * Periodically polls Shiprocket for tracking updates on orders that:
 * - Have an AWB assigned
 * - Are not in a final state (Delivered, Cancelled, RTO Delivered)
 * - Haven't been synced recently (configurable interval)
 * 
 * This serves as a fallback for:
 * - Missed webhooks
 * - Webhook delivery failures
 * - Initial sync after order creation
 * 
 * Run frequency: Every 15-30 minutes via cron scheduler
 */
const TRACKING_SYNC_INTERVAL_MS = parseInt(process.env.TRACKING_SYNC_INTERVAL_MS) || 15 * 60 * 1000; // 15 min default
const BATCH_SIZE = parseInt(process.env.TRACKING_SYNC_BATCH_SIZE) || 50;
const MAX_RETRY_ATTEMPTS = 3;

const FINAL_STATUSES = new Set([
  "Delivered",
  "Cancelled",
  "RTO Delivered",
  "Exception" // Requires manual intervention
]);

const RETURN_FINAL_STATUSES = new Set([
  "RTO Delivered",
  "Return Delivered",
  "Cancelled"
]);

let isRunning = false;
let lastRunTime = null;
let lastRunResult = null;

/**
 * Check if order needs tracking sync
 */
function needsTrackingSync(order) {
  const shipping = order.shipping || {};
  const returnShipment = order.returnShipment || {};
  
  // Check forward shipment
  const hasAWB = !!shipping.awb;
  const isNotFinal = hasAWB && !FINAL_STATUSES.has(shipping.currentStatus);
  const lastSync = shipping.lastTrackingUpdate ? new Date(shipping.lastTrackingUpdate).getTime() : 0;
  const needsSync = isNotFinal && (Date.now() - lastSync > TRACKING_SYNC_INTERVAL_MS);
  
  // Check return shipment
  const hasReturnAWB = !!returnShipment.awb;
  const isReturnNotFinal = hasReturnAWB && !RETURN_FINAL_STATUSES.has(returnShipment.status);
  const lastReturnSync = returnShipment.lastUpdate ? new Date(returnShipment.lastUpdate).getTime() : 0;
  const needsReturnSync = isReturnNotFinal && (Date.now() - lastReturnSync > TRACKING_SYNC_INTERVAL_MS);
  
  return needsSync || needsReturnSync;
}

/**
 * Run tracking sync for a batch of orders
 */
export async function runTrackingSyncJob() {
  if (isRunning) {
    logger.warn("Tracking sync job already running, skipping");
    return { skipped: true, reason: "Already running" };
  }

  isRunning = true;
  const startTime = Date.now();
  let processed = 0;
  let succeeded = 0;
  let failed = 0;
  let skipped = 0;
  const errors = [];

  try {
    logger.info("Starting tracking sync job");

    // Find orders needing sync
    const orders = await OrderModel.find({
      $or: [
        {
          "shipping.awb": { $exists: true, $ne: null },
          "shipping.currentStatus": { $nin: Array.from(FINAL_STATUSES) }
        },
        {
          "returnShipment.awb": { $exists: true, $ne: null },
          "returnShipment.status": { $nin: Array.from(RETURN_FINAL_STATUSES) }
        }
      ]
    })
    .select("_id shipping returnShipment orderNumber")
    .limit(BATCH_SIZE)
    .lean();

    logger.info({ count: orders.length }, "Found orders needing tracking sync");

    for (const order of orders) {
      try {
        const result = await refreshOrderTracking(order._id);
        if (result.orderFound) {
          if (result.newEvents > 0) {
            logger.info({ orderNumber: order.orderNumber, newEvents: result.newEvents }, "Tracking sync updated order");
            succeeded++;
          } else {
            logger.debug({ orderNumber: order.orderNumber }, "Tracking sync: no new events");
            skipped++;
          }
        } else {
          logger.warn({ orderNumber: order.orderNumber }, "Tracking sync: order not found for shipment");
          skipped++;
        }
        processed++;
      } catch (error) {
        failed++;
        errors.push({ orderId: order._id, orderNumber: order.orderNumber, error: error.message });
        logger.error({ orderId: order._id, orderNumber: order.orderNumber, error: error.message }, "Tracking sync failed for order");
      }
    }

    const duration = Date.now() - startTime;
    lastRunTime = new Date();
    lastRunResult = {
      timestamp: lastRunTime,
      duration,
      processed,
      succeeded,
      failed,
      skipped,
      errors: errors.length > 0 ? errors : undefined
    };

    logger.info(lastRunResult, "Tracking sync job completed");
    return lastRunResult;

  } catch (error) {
    logger.error({ error }, "Tracking sync job failed");
    isRunning = false;
    throw error;
  } finally {
    isRunning = false;
  }
}

/**
 * Get job status
 */
export function getTrackingSyncJobStatus() {
  return {
    isRunning,
    lastRunTime,
    lastRunResult,
    config: {
      intervalMs: TRACKING_SYNC_INTERVAL_MS,
      batchSize: BATCH_SIZE,
      maxRetryAttempts: MAX_RETRY_ATTEMPTS
    }
  };
}

/**
 * Manually trigger sync for specific orders
 */
export async function syncOrdersByIds(orderIds) {
  let processed = 0;
  let succeeded = 0;
  let failed = 0;
  const errors = [];

  for (const orderId of orderIds) {
    try {
      const result = await refreshOrderTracking(orderId);
      if (result.orderFound && result.newEvents > 0) {
        succeeded++;
      }
      processed++;
    } catch (error) {
      failed++;
      errors.push({ orderId, error: error.message });
    }
  }

  return { processed, succeeded, failed, errors };
}

export { needsTrackingSync };