import pino from "pino";
import { env } from "./env.schema.js";

const transport = env.NODE_ENV === "development"
  ? {
      target: "pino-pretty",
      options: {
        colorize: true,
        translateTime: "SYS:standard",
        ignore: "pid,hostname"
      }
    }
  : undefined;

const logger = pino({
  level: env.NODE_ENV === "development" ? "debug" : env.LOG_LEVEL
}, transport ? pino.transport(transport) : undefined);

export { logger };
