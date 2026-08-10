import { env, logger } from "../config/index.js";
import { AppError } from "../shared/app-error.js";
import { sendError } from "../shared/api-response.js";

const errorHandler = (error, req, res, next) => {
  if (res.headersSent) {
    return next(error);
  }

  const normalizedError = error instanceof AppError
    ? error
    : new AppError({
        message: "Internal server error.",
        statusCode: 500
      });

  const logPayload = {
    requestId: req.requestId,
    method: req.method,
    url: req.originalUrl,
    statusCode: normalizedError.statusCode,
    code: normalizedError.code,
    error: {
      message: error.message,
      stack: error.stack,
      details: normalizedError.details
    }
  };

  logger.error(logPayload, "Request failed.");

  return sendError({
    res,
    statusCode: normalizedError.statusCode,
    message: normalizedError.message,
    errors: normalizedError.errors
  });
};

export { errorHandler };
