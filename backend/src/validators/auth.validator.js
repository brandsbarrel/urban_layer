import { z } from "zod";
import { ADMIN_ROLES } from "../constants/index.js";

const emailSchema = z.string().trim().max(254).email().transform((value) => value.toLowerCase());
const passwordSchema = z.string().min(8).regex(/^(?=.*[A-Za-z])(?=.*\d).+$/, "Password must contain at least one letter and one number.");

const adminLoginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1)
});

const customerRegisterSchema = z.object({
  name: z.string().trim().min(1).max(120),
  email: emailSchema,
  password: passwordSchema
});

const customerLoginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1)
});

const forgotPasswordSchema = z.object({
  email: emailSchema
});

const resetPasswordSchema = z.object({
  token: z.string().min(1),
  password: passwordSchema
});

const createAdminSchema = z.object({
  name: z.string().trim().min(1).max(120),
  email: emailSchema,
  password: passwordSchema,
  role: z.enum(ADMIN_ROLES)
});

export {
  adminLoginSchema,
  customerRegisterSchema,
  customerLoginSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
  createAdminSchema
};
