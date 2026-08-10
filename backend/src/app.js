import compression from "compression";
import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";
import mongoSanitize from "express-mongo-sanitize";
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
  origin: env.FRONTEND_ORIGINS,
  credentials: true
}));
app.use(compression());
app.use(cookieParser());
app.use(express.json({ limit: "2mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(mongoSanitize());

app.use(env.API_BASE_PATH, apiRouter);
app.use(notFoundHandler);
app.use(errorHandler);

export { app };
