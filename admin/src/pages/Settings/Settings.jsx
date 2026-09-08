import React, { useState, useEffect } from "react";
import {
  MdLocalShipping,
  MdStore,
  MdSave,
  MdCheckCircle,
  MdError,
  MdInfo,
  MdKey,
  MdLocationOn
} from "react-icons/md";
import { fetchSettings, updateSettings as saveSettingsApi } from "../../api/settingsApi";
import styles from "./Settings.module.css";

const Settings = () => {
  const [activeTab, setActiveTab] = useState("shipping");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const [formData, setFormData] = useState({
    shiprocket: {
      pickupLocation: "Primary",
      pickupAddress: {
        name: "Urban Layers Warehouse",
        email: "",
        phone: "",
        address: "",
        address2: "",
        city: "",
        state: "",
        postalCode: "",
        country: "India"
      },
      credentials: {
        email: "",
        password: "",
        webhookSecret: ""
      },
      defaultPackageDimensions: {
        length: 10,
        breadth: 15,
        height: 20,
        weight: 0.5
      },
      shippingSettings: {
        flatRate: 1500,
        freeShippingThreshold: 50000,
        expressShippingFee: 2500
      }
    },
    general: {
      websiteName: "Urban Layers",
      websiteUrl: "https://urbanlayers.com",
      businessEmail: "",
      supportEmail: "",
      phone: "",
      currency: "INR",
      timezone: "Asia/Kolkata"
    }
  });

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      setLoading(true);
      const data = await fetchSettings();
      if (data) {
        setFormData((prev) => ({
          ...prev,
          general: { ...prev.general, ...(data.general || {}) },
          shiprocket: {
            ...prev.shiprocket,
            ...(data.shiprocket || {}),
            pickupAddress: {
              ...prev.shiprocket.pickupAddress,
              ...(data.shiprocket?.pickupAddress || {})
            },
            credentials: {
              ...prev.shiprocket.credentials,
              ...(data.shiprocket?.credentials || {})
            },
            defaultPackageDimensions: {
              ...prev.shiprocket.defaultPackageDimensions,
              ...(data.shiprocket?.defaultPackageDimensions || {})
            },
            shippingSettings: {
              ...prev.shiprocket.shippingSettings,
              ...(data.shiprocket?.shippingSettings || {})
            }
          }
        }));
      }
    } catch (err) {
      setErrorMessage("Failed to load settings: " + (err.message || "Unknown error"));
    } finally {
      setLoading(false);
    }
  };

  const handleShiprocketChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      shiprocket: {
        ...prev.shiprocket,
        [field]: value
      }
    }));
  };

  const handlePickupAddressChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      shiprocket: {
        ...prev.shiprocket,
        pickupAddress: {
          ...prev.shiprocket.pickupAddress,
          [field]: value
        }
      }
    }));
  };

  const handleCredentialsChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      shiprocket: {
        ...prev.shiprocket,
        credentials: {
          ...prev.shiprocket.credentials,
          [field]: value
        }
      }
    }));
  };

  const handleDimensionsChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      shiprocket: {
        ...prev.shiprocket,
        defaultPackageDimensions: {
          ...prev.shiprocket.defaultPackageDimensions,
          [field]: Number(value) || 0
        }
      }
    }));
  };

  const handleShippingRatesChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      shiprocket: {
        ...prev.shiprocket,
        shippingSettings: {
          ...prev.shiprocket.shippingSettings,
          [field]: Number(value) || 0
        }
      }
    }));
  };

  const handleGeneralChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      general: {
        ...prev.general,
        [field]: value
      }
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      setSuccessMessage("");
      setErrorMessage("");

      const payload = {
        general: formData.general,
        shiprocket: {
          pickupLocation: formData.shiprocket.pickupLocation,
          pickupAddress: formData.shiprocket.pickupAddress,
          defaultPackageDimensions: formData.shiprocket.defaultPackageDimensions,
          shippingSettings: formData.shiprocket.shippingSettings
        }
      };

      // Only include credentials if populated
      if (
        formData.shiprocket.credentials?.email ||
        formData.shiprocket.credentials?.password ||
        formData.shiprocket.credentials?.webhookSecret
      ) {
        payload.shiprocket.credentials = {};
        if (formData.shiprocket.credentials.email) {
          payload.shiprocket.credentials.email = formData.shiprocket.credentials.email;
        }
        if (formData.shiprocket.credentials.password) {
          payload.shiprocket.credentials.password = formData.shiprocket.credentials.password;
        }
        if (formData.shiprocket.credentials.webhookSecret) {
          payload.shiprocket.credentials.webhookSecret = formData.shiprocket.credentials.webhookSecret;
        }
      }

      await saveSettingsApi(payload);
      setSuccessMessage("Settings saved successfully.");
      setTimeout(() => setSuccessMessage(""), 4000);
    } catch (err) {
      setErrorMessage("Failed to save settings: " + (err.message || "Unknown error"));
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className={styles.page}>
        <div className={styles.card}>Loading settings...</div>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <div className={styles.pageHeader}>
        <div>
          <h1 className={styles.title}>Store Settings</h1>
          <p className={styles.subtitle}>
            Configure universal pickup locations, Shiprocket courier integration, package defaults, and store details.
          </p>
        </div>
      </div>

      {successMessage && (
        <div className={styles.alertSuccess}>
          <MdCheckCircle size={20} />
          <span>{successMessage}</span>
        </div>
      )}

      {errorMessage && (
        <div className={styles.alertError}>
          <MdError size={20} />
          <span>{errorMessage}</span>
        </div>
      )}

      <div className={styles.tabsRow}>
        <button
          type="button"
          className={`${styles.tabBtn} ${activeTab === "shipping" ? styles.tabBtnActive : ""}`}
          onClick={() => setActiveTab("shipping")}
        >
          <MdLocalShipping size={18} />
          <span>Shipping &amp; Shiprocket</span>
        </button>
        <button
          type="button"
          className={`${styles.tabBtn} ${activeTab === "general" ? styles.tabBtnActive : ""}`}
          onClick={() => setActiveTab("general")}
        >
          <MdStore size={18} />
          <span>General Store</span>
        </button>
      </div>

      <form onSubmit={handleSubmit}>
        {activeTab === "shipping" && (
          <>
            {/* Universal Pickup Location Card */}
            <div className={styles.card}>
              <div className={styles.cardHeader}>
                <h3 className={styles.cardTitle}>
                  <MdLocationOn size={20} style={{ color: "#2563eb" }} />
                  Universal Default Pickup Location
                </h3>
                <p className={styles.cardSubtitle}>
                  This is the default pickup location nickname registered in your Shiprocket account. Any product without a custom pickup location will automatically use this location.
                </p>
              </div>

              <div className={styles.highlightBox}>
                <MdInfo size={18} style={{ verticalAlign: "middle", marginRight: "6px" }} />
                <strong>How Pickup Locations work:</strong> If a product has a custom pickup location specified in its product edit form, orders for that product will dispatch from that location. Otherwise, orders will fall back to this Universal Pickup Location. Make sure this nickname matches the pickup address configured in your Shiprocket dashboard (e.g. <code>Primary</code>).
              </div>

              <div className={styles.fieldGroup}>
                <label className={styles.label}>Universal Pickup Location Nickname (Shiprocket)</label>
                <input
                  type="text"
                  className={styles.input}
                  value={formData.shiprocket.pickupLocation}
                  onChange={(e) => handleShiprocketChange("pickupLocation", e.target.value)}
                  placeholder="Primary"
                  required
                />
                <span className={styles.hint}>
                  Must match the exact pickup location name in your Shiprocket dashboard under Settings &gt; Pickup Addresses.
                </span>
              </div>
            </div>

            {/* Default Warehouse / Pickup Address */}
            <div className={styles.card}>
              <div className={styles.cardHeader}>
                <h3 className={styles.cardTitle}>Warehouse / Contact Details</h3>
                <p className={styles.cardSubtitle}>Default physical warehouse information used for shipping manifests and return labels.</p>
              </div>

              <div className={styles.grid2}>
                <div className={styles.fieldGroup}>
                  <label className={styles.label}>Warehouse / Sender Name</label>
                  <input
                    type="text"
                    className={styles.input}
                    value={formData.shiprocket.pickupAddress.name}
                    onChange={(e) => handlePickupAddressChange("name", e.target.value)}
                    placeholder="Urban Layers Warehouse"
                  />
                </div>
                <div className={styles.fieldGroup}>
                  <label className={styles.label}>Contact Phone</label>
                  <input
                    type="text"
                    className={styles.input}
                    value={formData.shiprocket.pickupAddress.phone}
                    onChange={(e) => handlePickupAddressChange("phone", e.target.value)}
                    placeholder="9876543210"
                  />
                </div>
              </div>

              <div className={styles.grid2}>
                <div className={styles.fieldGroup}>
                  <label className={styles.label}>Contact Email</label>
                  <input
                    type="email"
                    className={styles.input}
                    value={formData.shiprocket.pickupAddress.email}
                    onChange={(e) => handlePickupAddressChange("email", e.target.value)}
                    placeholder="warehouse@urbanlayers.com"
                  />
                </div>
                <div className={styles.fieldGroup}>
                  <label className={styles.label}>Street Address (Line 1)</label>
                  <input
                    type="text"
                    className={styles.input}
                    value={formData.shiprocket.pickupAddress.address}
                    onChange={(e) => handlePickupAddressChange("address", e.target.value)}
                    placeholder="123 Industrial Area, Phase 2"
                  />
                </div>
              </div>

              <div className={styles.grid4}>
                <div className={styles.fieldGroup}>
                  <label className={styles.label}>City</label>
                  <input
                    type="text"
                    className={styles.input}
                    value={formData.shiprocket.pickupAddress.city}
                    onChange={(e) => handlePickupAddressChange("city", e.target.value)}
                    placeholder="New Delhi"
                  />
                </div>
                <div className={styles.fieldGroup}>
                  <label className={styles.label}>State</label>
                  <input
                    type="text"
                    className={styles.input}
                    value={formData.shiprocket.pickupAddress.state}
                    onChange={(e) => handlePickupAddressChange("state", e.target.value)}
                    placeholder="Delhi"
                  />
                </div>
                <div className={styles.fieldGroup}>
                  <label className={styles.label}>Pincode</label>
                  <input
                    type="text"
                    className={styles.input}
                    value={formData.shiprocket.pickupAddress.postalCode}
                    onChange={(e) => handlePickupAddressChange("postalCode", e.target.value)}
                    placeholder="110020"
                  />
                </div>
                <div className={styles.fieldGroup}>
                  <label className={styles.label}>Country</label>
                  <input
                    type="text"
                    className={styles.input}
                    value={formData.shiprocket.pickupAddress.country}
                    onChange={(e) => handlePickupAddressChange("country", e.target.value)}
                    placeholder="India"
                  />
                </div>
              </div>
            </div>

            {/* Default Package Dimensions */}
            <div className={styles.card}>
              <div className={styles.cardHeader}>
                <h3 className={styles.cardTitle}>Default Package Dimensions</h3>
                <p className={styles.cardSubtitle}>Fallback dimensions and weight used when a product does not specify its own dimensions.</p>
              </div>

              <div className={styles.grid4}>
                <div className={styles.fieldGroup}>
                  <label className={styles.label}>Length (cm)</label>
                  <input
                    type="number"
                    step="0.1"
                    className={styles.input}
                    value={formData.shiprocket.defaultPackageDimensions.length}
                    onChange={(e) => handleDimensionsChange("length", e.target.value)}
                  />
                </div>
                <div className={styles.fieldGroup}>
                  <label className={styles.label}>Breadth (cm)</label>
                  <input
                    type="number"
                    step="0.1"
                    className={styles.input}
                    value={formData.shiprocket.defaultPackageDimensions.breadth}
                    onChange={(e) => handleDimensionsChange("breadth", e.target.value)}
                  />
                </div>
                <div className={styles.fieldGroup}>
                  <label className={styles.label}>Height (cm)</label>
                  <input
                    type="number"
                    step="0.1"
                    className={styles.input}
                    value={formData.shiprocket.defaultPackageDimensions.height}
                    onChange={(e) => handleDimensionsChange("height", e.target.value)}
                  />
                </div>
                <div className={styles.fieldGroup}>
                  <label className={styles.label}>Weight (kg)</label>
                  <input
                    type="number"
                    step="0.01"
                    className={styles.input}
                    value={formData.shiprocket.defaultPackageDimensions.weight}
                    onChange={(e) => handleDimensionsChange("weight", e.target.value)}
                  />
                </div>
              </div>
            </div>

            {/* Shiprocket Credentials */}
            <div className={styles.card}>
              <div className={styles.cardHeader}>
                <h3 className={styles.cardTitle}>
                  <MdKey size={20} style={{ color: "#d97706" }} />
                  Shiprocket API Credentials (Optional Override)
                </h3>
                <p className={styles.cardSubtitle}>
                  Leave blank to continue using the credentials defined in your backend <code>.env</code> file.
                </p>
              </div>

              <div className={styles.grid3}>
                <div className={styles.fieldGroup}>
                  <label className={styles.label}>Shiprocket Email</label>
                  <input
                    type="email"
                    className={styles.input}
                    value={formData.shiprocket.credentials.email}
                    onChange={(e) => handleCredentialsChange("email", e.target.value)}
                    placeholder="shiprocket@urbanlayers.com"
                  />
                </div>
                <div className={styles.fieldGroup}>
                  <label className={styles.label}>Shiprocket Password</label>
                  <input
                    type="password"
                    className={styles.input}
                    value={formData.shiprocket.credentials.password}
                    onChange={(e) => handleCredentialsChange("password", e.target.value)}
                    placeholder="••••••••"
                  />
                </div>
                <div className={styles.fieldGroup}>
                  <label className={styles.label}>Webhook Secret</label>
                  <input
                    type="text"
                    className={styles.input}
                    value={formData.shiprocket.credentials.webhookSecret}
                    onChange={(e) => handleCredentialsChange("webhookSecret", e.target.value)}
                    placeholder="Secret token for tracking webhooks"
                  />
                </div>
              </div>
            </div>
          </>
        )}

        {activeTab === "general" && (
          <div className={styles.card}>
            <div className={styles.cardHeader}>
              <h3 className={styles.cardTitle}>General Store Details</h3>
              <p className={styles.cardSubtitle}>Basic store profile and customer communication contact details.</p>
            </div>

            <div className={styles.grid2}>
              <div className={styles.fieldGroup}>
                <label className={styles.label}>Store / Website Name</label>
                <input
                  type="text"
                  className={styles.input}
                  value={formData.general.websiteName}
                  onChange={(e) => handleGeneralChange("websiteName", e.target.value)}
                  placeholder="Urban Layers"
                />
              </div>
              <div className={styles.fieldGroup}>
                <label className={styles.label}>Website URL</label>
                <input
                  type="url"
                  className={styles.input}
                  value={formData.general.websiteUrl}
                  onChange={(e) => handleGeneralChange("websiteUrl", e.target.value)}
                  placeholder="https://urbanlayers.com"
                />
              </div>
            </div>

            <div className={styles.grid3}>
              <div className={styles.fieldGroup}>
                <label className={styles.label}>Business Email</label>
                <input
                  type="email"
                  className={styles.input}
                  value={formData.general.businessEmail}
                  onChange={(e) => handleGeneralChange("businessEmail", e.target.value)}
                  placeholder="business@urbanlayers.com"
                />
              </div>
              <div className={styles.fieldGroup}>
                <label className={styles.label}>Support Email</label>
                <input
                  type="email"
                  className={styles.input}
                  value={formData.general.supportEmail}
                  onChange={(e) => handleGeneralChange("supportEmail", e.target.value)}
                  placeholder="support@urbanlayers.com"
                />
              </div>
              <div className={styles.fieldGroup}>
                <label className={styles.label}>Support Phone</label>
                <input
                  type="text"
                  className={styles.input}
                  value={formData.general.phone}
                  onChange={(e) => handleGeneralChange("phone", e.target.value)}
                  placeholder="+91 9876543210"
                />
              </div>
            </div>
          </div>
        )}

        <div className={styles.actionsRow}>
          <button type="submit" className={styles.saveBtn} disabled={saving}>
            <MdSave size={18} />
            <span>{saving ? "Saving..." : "Save Settings"}</span>
          </button>
        </div>
      </form>
    </div>
  );
};

export default Settings;
