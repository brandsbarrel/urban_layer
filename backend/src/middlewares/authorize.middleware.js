import { AuthorizationError } from "../shared/app-error.js";

const authorize = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user || !allowedRoles.includes(req.user.role)) {
      return next(new AuthorizationError());
    }

    return next();
  };
};

export { authorize };
