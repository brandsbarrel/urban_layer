import compression from "compression";
import cors from "cors";
import express from "express";
import helmet from "helmet";
import pinoHttp from "pino-http";
import { env, logger } from "./config/index.js";
import { errorHandler } from "./middlewares/error-handler.middleware.js";
import { notFoundHandler } from "./middlewares/not-found.middleware.js";
import { attachRequestId } from "./middlewares/request-id.middleware.js";
import { apiRouter } from "./routes/index.js";

const app = express();

app.disable("x-powered-by");

app.use(attachRequestId);
app.use(pinoHttp({
  logger,
  genReqId: (req) => req.requestId
}));
app.use(helmet());
app.use(cors({
  origin: env.FRONTEND_ORIGINS
}));
app.use(compression());
app.use(express.json({
  limit: "25mb",
  verify: (req, res, buf) => {
    req.rawBody = buf;
  }
}));
app.use(express.urlencoded({ extended: true, limit: "25mb" }));

app.use(env.API_BASE_PATH, apiRouter);
app.use(notFoundHandler);
app.use(errorHandler);

export { app };
