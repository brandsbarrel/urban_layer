import http from "node:http";
import { app } from "./app.js";
import { env, logger } from "./config/index.js";
import { connectMongo, disconnectMongo } from "./database/mongo.js";

const server = http.createServer(app);

const startServer = async () => {
  await connectMongo();

  server.listen(env.PORT, () => {
    logger.info({ port: env.PORT }, "HTTP server listening.");
  });
};

const shutdown = async (signal) => {
  logger.info({ signal }, "Shutdown signal received.");

  server.close(async (serverError) => {
    if (serverError) {
      logger.error({ error: serverError }, "Error while closing HTTP server.");
      process.exit(1);
    }

    await disconnectMongo();

    process.exit(0);
  });
};

process.on("SIGINT", () => {
  void shutdown("SIGINT");
});

process.on("SIGTERM", () => {
  void shutdown("SIGTERM");
});

void startServer().catch((error) => {
  logger.fatal({ error }, "Failed to start server.");
  process.exit(1);
});

export { server, startServer };
