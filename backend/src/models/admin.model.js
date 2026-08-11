import mongoose from "mongoose";
import { ADMIN_ROLES } from "../constants/index.js";

const loginHistorySchema = new mongoose.Schema(
  {
    ip: {
      type: String,
      trim: true
    },
    userAgent: {
      type: String,
      trim: true
    },
    at: {
      type: Date,
      default: Date.now
    }
  },
  {
    _id: false
  }
);

const adminSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true
    },
    passwordHash: {
      type: String,
      required: true,
      select: false
    },
    role: {
      type: String,
      enum: ADMIN_ROLES,
      required: true,
      default: "Admin"
    },
    avatarUrl: {
      type: String,
      trim: true
    },
    isActive: {
      type: Boolean,
      default: true
    },
    tokenVersion: {
      type: Number,
      default: 0
    },
    lastLoginAt: {
      type: Date
    },
    loginHistory: {
      type: [loginHistorySchema],
      default: []
    }
  },
  {
    timestamps: true
  }
);

adminSchema.index({ email: 1 }, { unique: true });

const AdminModel = mongoose.model("Admin", adminSchema);

export { AdminModel };
