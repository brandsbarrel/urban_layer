import { runTrackingSyncJob, getTrackingSyncJobStatus } from "./tracking-sync.job.js";
import { logger } from "../config/logger.js";

let cronJob = null;

/**
 * Start all scheduled jobs
 * In production, use a proper cron library like node-cron or integrate with a job queue
 */
export function startJobs() {
  // For now, we'll use setInterval as a simple scheduler
  // In production, replace with node-cron: cron.schedule("*/15 * * * *", runTrackingSyncJob)
  
  const intervalMs = parseInt(process.env.TRACKING_SYNC_INTERVAL_MS) || 15 * 60 * 1000;
  
  logger.info({ intervalMs }, "Starting tracking sync job scheduler");
  
  // Run once on startup (after a short delay to let app fully start)
  setTimeout(() => {
    runTrackingSyncJob().catch(err => logger.error({ err }, "Initial tracking sync failed"));
  }, 30000);

  // Schedule recurring runs
  cronJob = setInterval(() => {
    runTrackingSyncJob().catch(err => logger.error({ err }, "Scheduled tracking sync failed"));
  }, intervalMs);

  // Prevent process from exiting due to this interval
  cronJob.unref();
  
  return cronJob;
}

/**
 * Stop all scheduled jobs
 */
export function stopJobs() {
  if (cronJob) {
    clearInterval(cronJob);
    cronJob = null;
    logger.info("Stopped all scheduled jobs");
  }
}

/**
 * Get status of all jobs
 */
export function getJobsStatus() {
  return {
    trackingSync: getTrackingSyncJobStatus()
  };
}

/**
 * Manually trigger a job run
 */
export async function triggerJob(jobName, params = {}) {
  switch (jobName) {
    case "trackingSync":
      return runTrackingSyncJob(params.orderIds);
    default:
      throw new Error(`Unknown job: ${jobName}`);
  }
}

export { runTrackingSyncJob, getTrackingSyncJobStatus };