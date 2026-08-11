import { sendSuccess } from "../shared/api-response.js";
import {
  loginAdmin,
  logoutAdmin,
  registerAdmin
} from "../services/admin-auth.service.js";
import { hashPassword } from "../utils/password.js";

const adminLogin = async (req, res, next) => {
  try {
    const data = await loginAdmin({
      ...req.body,
      ip: req.ip,
      userAgent: req.headers["user-agent"] || ""
    });

    return sendSuccess({
      res,
      message: "Admin login successful.",
      data
    });
  } catch (error) {
    return next(error);
  }
};

const adminLogout = async (req, res, next) => {
  try {
    logoutAdmin();

    return sendSuccess({
      res,
      message: "Admin logout successful."
    });
  } catch (error) {
    return next(error);
  }
};

const adminCreate = async (req, res, next) => {
  try {
    const passwordHash = await hashPassword(req.body.password);
    const admin = await registerAdmin({
      ...req.body,
      passwordHash
    });

    return sendSuccess({
      res,
      statusCode: 201,
      message: "Admin account created successfully.",
      data: {
        id: admin.id,
        name: admin.name,
        email: admin.email,
        role: admin.role
      }
    });
  } catch (error) {
    return next(error);
  }
};

export { adminLogin, adminLogout, adminCreate };
