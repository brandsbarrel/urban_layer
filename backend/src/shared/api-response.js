const sendSuccess = ({
  res,
  statusCode = 200,
  message = "Request completed successfully.",
  data,
  meta
}) => {
  const payload = {
    success: true,
    message
  };

  if (typeof data !== "undefined") {
    payload.data = data;
  }

  if (typeof meta !== "undefined") {
    payload.meta = meta;
  }

  return res.status(statusCode).json(payload);
};

const sendError = ({
  res,
  statusCode = 500,
  message = "Something went wrong.",
  errors
}) => {
  const payload = {
    success: false,
    message
  };

  if (Array.isArray(errors) && errors.length > 0) {
    payload.errors = errors;
  }

  return res.status(statusCode).json(payload);
};

export { sendSuccess, sendError };
