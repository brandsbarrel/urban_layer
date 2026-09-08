import mongoose from "mongoose";

const shiprocketSettingsSchema = new mongoose.Schema(
  {
    pickupLocation: {
      type: String,
      default: "Primary",
      trim: true
    },
    pickupAddress: {
      name: { type: String, trim: true, default: "Urban Layers Warehouse" },
      email: { type: String, trim: true, lowercase: true, default: "" },
      phone: { type: String, trim: true, default: "" },
      address: { type: String, trim: true, default: "" },
      address2: { type: String, trim: true, default: "" },
      city: { type: String, trim: true, default: "" },
      state: { type: String, trim: true, default: "" },
      postalCode: { type: String, trim: true, default: "" },
      country: { type: String, trim: true, default: "India" }
    },
    credentials: {
      email: { type: String, trim: true, lowercase: true },
      password: { type: String, select: false },
      webhookSecret: { type: String, select: false }
    },
    defaultPackageDimensions: {
      length: { type: Number, default: 10 },
      breadth: { type: Number, default: 15 },
      height: { type: Number, default: 20 },
      weight: { type: Number, default: 0.5 }
    },
    courierPreferences: {
      defaultCourier: { type: String, trim: true, default: "Delhivery" },
      preferredCouriers: [{ type: String, trim: true }],
      codEnabled: { type: Boolean, default: true },
      prepaidEnabled: { type: Boolean, default: true }
    },
    shippingSettings: {
      flatRate: { type: Number, default: 1500 },
      freeShippingThreshold: { type: Number, default: 50000 },
      expressShippingFee: { type: Number, default: 2500 }
    }
  },
  { _id: false }
);

const generalSettingsSchema = new mongoose.Schema(
  {
    websiteName: { type: String, trim: true, default: "Urban Layers" },
    websiteUrl: { type: String, trim: true, default: "https://urbanlayers.com" },
    businessEmail: { type: String, trim: true, lowercase: true },
    supportEmail: { type: String, trim: true, lowercase: true },
    phone: { type: String, trim: true },
    currency: { type: String, default: "INR" },
    timezone: { type: String, default: "Asia/Kolkata" }
  },
  { _id: false }
);

const brandingSettingsSchema = new mongoose.Schema(
  {
    logoUrl: { type: String, trim: true },
    faviconUrl: { type: String, trim: true },
    brandColors: {
      primary: { type: String, default: "#1a1a2e" },
      secondary: { type: String, default: "#16213e" },
      accent: { type: String, default: "#e94560" }
    }
  },
  { _id: false }
);

const paymentSettingsSchema = new mongoose.Schema(
  {
    codEnabled: { type: Boolean, default: true },
    razorpayEnabled: { type: Boolean, default: true },
    razorpayKeyId: { type: String, trim: true, select: false },
    razorpayKeySecret: { type: String, trim: true, select: false },
    razorpayWebhookSecret: { type: String, trim: true, select: false }
  },
  { _id: false }
);

const settingsSchema = new mongoose.Schema(
  {
    _id: { type: String, default: "global_settings" },
    general: { type: generalSettingsSchema, default: () => ({}) },
    branding: { type: brandingSettingsSchema, default: () => ({}) },
    payment: { type: paymentSettingsSchema, default: () => ({}) },
    shiprocket: { type: shiprocketSettingsSchema, default: () => ({}) },
    shipping: { 
      type: new mongoose.Schema({
        flatRate: { type: Number, default: 1500 },
        freeShippingThreshold: { type: Number, default: 50000 },
        expressShippingFee: { type: Number, default: 2500 }
      }, { _id: false }),
      default: () => ({})
    },
    contact: {
      type: new mongoose.Schema({
        address: { type: String, trim: true },
        phone: { type: String, trim: true },
        email: { type: String, trim: true, lowercase: true },
        businessHours: { type: String, trim: true }
      }, { _id: false }),
      default: () => ({})
    },
    social: {
      type: new mongoose.Schema({
        instagram: { type: String, trim: true },
        facebook: { type: String, trim: true },
        youtube: { type: String, trim: true },
        linkedin: { type: String, trim: true }
      }, { _id: false }),
      default: () => ({})
    },
    seo: {
      type: new mongoose.Schema({
        metaTitle: { type: String, trim: true },
        metaDescription: { type: String, trim: true },
        analyticsId: { type: String, trim: true },
        sitemapUrl: { type: String, trim: true }
      }, { _id: false }),
      default: () => ({})
    },
    homepage: {
      type: new mongoose.Schema({
        heroBannerImage: { type: String, trim: true },
        featuredCategoryIds: [{ type: String }],
        featuredProductIds: [{ type: String }]
      }, { _id: false }),
      default: () => ({})
    }
  },
  { 
    timestamps: true,
    _id: false
  }
);

settingsSchema.index({ _id: 1 }, { unique: true });

const SettingsModel = mongoose.model("Settings", settingsSchema);

export async function getSettings() {
  let settings = await SettingsModel.findById("global_settings").lean();
  
  if (!settings) {
    settings = await SettingsModel.create({ _id: "global_settings" });
    settings = settings.toObject();
  }
  
  return settings;
}

export async function updateSettings(updates) {
  const settings = await SettingsModel.findByIdAndUpdate(
    "global_settings",
    { $set: updates },
    { new: true, upsert: true, runValidators: true }
  ).lean();
  
  return settings;
}

export async function getShiprocketSettings() {
  const settings = await getSettings();
  return settings.shiprocket || {};
}

export async function getPaymentSettings() {
  const settings = await getSettings();
  return settings.payment || {};
}

export { SettingsModel };