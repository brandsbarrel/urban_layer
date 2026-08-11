import { env } from "../config/index.js";
import { sendSuccess } from "../shared/api-response.js";

const getHealth = (req, res) => {
  return sendSuccess({
    res,
    message: "Service is healthy.",
    data: {
      appName: env.APP_NAME,
      environment: env.NODE_ENV
    }
  });
};

export { getHealth };
