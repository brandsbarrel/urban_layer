import { sendSuccess } from "../shared/api-response.js";
import { getSettings, updateSettings } from "../models/settings.model.js";
import { env } from "../config/index.js";

/**
 * Get store and integration settings
 * GET /api/admin/settings
 */
export const getSettingsHandler = async (req, res, next) => {
  try {
    const settings = await getSettings();

    // Prepare safe representation
    const safeSettings = {
      ...settings,
      shiprocket: {
        ...(settings?.shiprocket || {}),
        credentials: {
          email: settings?.shiprocket?.credentials?.email || env.SHIPROCKET_EMAIL || "",
          hasPassword: Boolean(settings?.shiprocket?.credentials?.password || env.SHIPROCKET_PASSWORD),
          hasWebhookSecret: Boolean(settings?.shiprocket?.credentials?.webhookSecret || env.SHIPROCKET_WEBHOOK_SECRET)
        }
      }
    };

    return sendSuccess({
      res,
      message: "Settings fetched successfully.",
      data: safeSettings
    });
  } catch (error) {
    return next(error);
  }
};

/**
 * Update store and integration settings
 * PUT /api/admin/settings or PATCH /api/admin/settings
 */
export const updateSettingsHandler = async (req, res, next) => {
  try {
    const updates = req.body;
    const updatedSettings = await updateSettings(updates);

    return sendSuccess({
      res,
      message: "Settings updated successfully.",
      data: updatedSettings
    });
  } catch (error) {
    return next(error);
  }
};
