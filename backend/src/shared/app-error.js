class AppError extends Error {
  constructor({
    message,
    statusCode = 500,
    errors = [],
    code = "APP_ERROR",
    details = {}
  }) {
    super(message);

    this.name = this.constructor.name;
    this.statusCode = statusCode;
    this.errors = errors;
    this.code = code;
    this.details = details;
    Error.captureStackTrace?.(this, this.constructor);
  }
}

class ValidationError extends AppError {
  constructor({ message = "Validation failed.", errors = [] }) {
    super({ message, statusCode: 400, errors, code: "VALIDATION_ERROR" });
  }
}

class AuthenticationError extends AppError {
  constructor(message = "Authentication required.") {
    super({ message, statusCode: 401, code: "AUTHENTICATION_ERROR" });
  }
}

class AuthorizationError extends AppError {
  constructor(message = "You are not allowed to perform this action.") {
    super({ message, statusCode: 403, code: "AUTHORIZATION_ERROR" });
  }
}

class NotFoundError extends AppError {
  constructor(message = "Resource not found.") {
    super({ message, statusCode: 404, code: "NOT_FOUND_ERROR" });
  }
}

class ConflictError extends AppError {
  constructor({ message = "Resource conflict.", errors = [], details = {} }) {
    super({ message, statusCode: 409, errors, details, code: "CONFLICT_ERROR" });
  }
}

class BusinessRuleError extends AppError {
  constructor({ message = "Business rule violation.", errors = [], details = {} }) {
    super({ message, statusCode: 422, errors, details, code: "BUSINESS_RULE_ERROR" });
  }
}

class ExternalServiceError extends AppError {
  constructor({ message = "External service request failed.", provider, originalError }) {
    super({
      message,
      statusCode: 502,
      code: "EXTERNAL_SERVICE_ERROR",
      details: { provider }
    });

    this.originalError = originalError;
  }
}

export {
  AppError,
  ValidationError,
  AuthenticationError,
  AuthorizationError,
  NotFoundError,
  ConflictError,
  BusinessRuleError,
  ExternalServiceError
};
