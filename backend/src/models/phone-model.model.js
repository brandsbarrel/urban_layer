import mongoose from "mongoose";

const phoneModelSchema = new mongoose.Schema(
  {
    brand: {
      type: String,
      required: true,
      trim: true
    },
    name: {
      type: String,
      required: true,
      trim: true
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      trim: true
    },
    active: {
      type: Boolean,
      default: true
    },
    sortOrder: {
      type: Number,
      default: 0
    }
  },
  {
    timestamps: true
  }
);

phoneModelSchema.index({ slug: 1 }, { unique: true });
phoneModelSchema.index({ active: 1, sortOrder: 1 });
phoneModelSchema.index({ brand: "text", name: "text", slug: "text" });

const PhoneModel = mongoose.model("PhoneModel", phoneModelSchema);

export { PhoneModel };
