import mongoose from "mongoose";
import { env, logger } from "../config/index.js";

const connectMongo = async () => {
  mongoose.set("strictQuery", true);

  await mongoose.connect(env.MONGO_URI);

  logger.info("MongoDB connection established.");
};

const disconnectMongo = async () => {
  if (mongoose.connection.readyState === 0) {
    return;
  }

  await mongoose.disconnect();
  logger.info("MongoDB connection closed.");
};

export { connectMongo, disconnectMongo, mongoose };
