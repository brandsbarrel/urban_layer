import dotenv from "dotenv";
import { z } from "zod";

dotenv.config();

const envSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  PORT: z.coerce.number().int().positive().default(4000),
  APP_NAME: z.string().min(1).default("Urban Layers API"),
  API_BASE_PATH: z.string().min(1).default("/api"),
  MONGO_URI: z.string().min(1, "MONGO_URI is required."),
  REDIS_URL: z.string().min(1, "REDIS_URL is required."),
  ADMIN_JWT_ACCESS_SECRET: z.string().min(32),
  CUSTOMER_JWT_ACCESS_SECRET: z.string().min(32),
  FRONTEND_ORIGINS: z.string().min(1, "FRONTEND_ORIGINS is required."),
  CLOUDINARY_CLOUD_NAME: z.string().min(1),
  CLOUDINARY_API_KEY: z.string().min(1),
  CLOUDINARY_API_SECRET: z.string().min(1),
  RAZORPAY_KEY_ID: z.string().min(1),
  RAZORPAY_KEY_SECRET: z.string().min(1),
  RAZORPAY_WEBHOOK_SECRET: z.string().min(1),
  SHIPROCKET_EMAIL: z.string().email(),
  SHIPROCKET_PASSWORD: z.string().min(1),
  SHIPROCKET_WEBHOOK_SECRET: z.string().min(1),
  RESEND_API_KEY: z.string().min(1),
  RESEND_FROM_EMAIL: z.string().email(),
  LOG_LEVEL: z.enum(["fatal", "error", "warn", "info", "debug", "trace", "silent"]).default("info")
});

const envResult = envSchema.safeParse(process.env);

if (!envResult.success) {
  const issues = envResult.error.issues.map((issue) => {
    const path = issue.path.join(".") || "env";
    return `${path}: ${issue.message}`;
  });

  throw new Error(`Environment validation failed:\n${issues.join("\n")}`);
}

const env = {
  ...envResult.data,
  FRONTEND_ORIGINS: envResult.data.FRONTEND_ORIGINS.split(",")
    .map((origin) => origin.trim())
    .filter(Boolean)
};

export { env };
