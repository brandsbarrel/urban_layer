import { NotFoundError } from "../shared/app-error.js";

const notFoundHandler = (req, res, next) => {
  next(new NotFoundError(`Route not found: ${req.method} ${req.originalUrl}`));
};

export { notFoundHandler };
