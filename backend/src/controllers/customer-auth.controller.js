import { AuthenticationError } from "../shared/app-error.js";
import { sendSuccess } from "../shared/api-response.js";
import {
  loginCustomer,
  logoutCustomer,
  refreshCustomerSession,
  registerCustomer
} from "../services/customer-auth.service.js";

const customerRegister = async (req, res, next) => {
  try {
    const customer = await registerCustomer(req.body);

    return sendSuccess({
      res,
      statusCode: 201,
      message: "Customer account created successfully.",
      data: {
        id: customer.id,
        name: customer.name,
        email: customer.email,
        status: customer.status
      }
    });
  } catch (error) {
    return next(error);
  }
};

const customerLogin = async (req, res, next) => {
  try {
    const data = await loginCustomer({
      ...req.body,
      res
    });

    return sendSuccess({
      res,
      message: "Customer login successful.",
      data
    });
  } catch (error) {
    return next(error);
  }
};

const customerRefresh = async (req, res, next) => {
  try {
    const refreshToken = req.cookies?.customer_refresh_token;

    if (!refreshToken) {
      throw new AuthenticationError("Refresh token is required.");
    }

    const data = await refreshCustomerSession({ refreshToken, res });

    return sendSuccess({
      res,
      message: "Customer session refreshed.",
      data
    });
  } catch (error) {
    return next(error);
  }
};

const customerLogout = async (req, res, next) => {
  try {
    logoutCustomer(res);

    return sendSuccess({
      res,
      message: "Customer logout successful."
    });
  } catch (error) {
    return next(error);
  }
};

export { customerRegister, customerLogin, customerRefresh, customerLogout };
