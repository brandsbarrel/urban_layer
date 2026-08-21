import mongoose from "mongoose";
import { logger } from "../config/index.js";

/**
 * Executes a workload inside a MongoDB transaction when running on a replica set
 * or sharded cluster (e.g. MongoDB Atlas), or falls back to normal sequential
 * execution when running on a local standalone MongoDB instance.
 *
 * @param {Function} workFn - Function receiving transaction options `{ session }` or `{}`
 * @returns {Promise<any>} Result of workFn
 */
const runWithOptionalTransaction = async (workFn) => {
  let session = null;
  try {
    session = await mongoose.startSession();
    let result;
    await session.withTransaction(async () => {
      result = await workFn({ session });
    });
    return result;
  } catch (error) {
    const isStandaloneError =
      (error.message && error.message.includes("Transaction numbers are only allowed")) ||
      error.code === 20 ||
      error.codeName === "IllegalOperation";

    if (isStandaloneError) {
      logger.warn(
        "Standalone MongoDB detected (no replica set). Executing operations sequentially without transaction session."
      );
      return await workFn({});
    }

    throw error;
  } finally {
    if (session) {
      await session.endSession();
    }
  }
};

export { runWithOptionalTransaction };
