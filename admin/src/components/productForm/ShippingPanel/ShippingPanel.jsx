import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { updateField } from "../../../redux/slices/productFormSlice";
import styles from "./ShippingPanel.module.css";

const ShippingPanel = () => {
  const dispatch = useDispatch();
  const form = useSelector((state) => state.productForm.form);

  const set = (field) => (e) =>
    dispatch(updateField({ field, value: e.target.value }));

  return (
    <section className={styles.card}>
      <h4 className={styles.title}>Shipping &amp; Delivery</h4>

      <div className={styles.fieldGroup}>
        <label className={styles.label}>Weight (kg)</label>
        <input
          className={styles.input}
          type="text"
          value={form.weight}
          onChange={set("weight")}
        />
      </div>

      <div className={styles.twoCol}>
        <div className={styles.fieldGroup}>
          <label className={styles.label}>Package Type</label>
          <select
            className={styles.input}
            value={form.packageType}
            onChange={set("packageType")}
          >
            <option value="Box">Box</option>
            <option value="Padded Envelope">Padded Envelope</option>
            <option value="Mailer">Mailer</option>
          </select>
        </div>
        <div className={styles.fieldGroup}>
          <label className={styles.label}>Shipping Class</label>
          <select
            className={styles.input}
            value={form.shippingClass}
            onChange={set("shippingClass")}
          >
            <option value="Standard">Standard</option>
            <option value="Express">Express</option>
            <option value="Fragile">Fragile</option>
          </select>
        </div>
      </div>

      <div className={styles.threeCol}>
        <div className={styles.fieldGroup}>
          <label className={styles.label}>Length (cm)</label>
          <input
            className={styles.input}
            type="text"
            value={form.length}
            onChange={set("length")}
          />
        </div>
        <div className={styles.fieldGroup}>
          <label className={styles.label}>Width (cm)</label>
          <input
            className={styles.input}
            type="text"
            value={form.width}
            onChange={set("width")}
          />
        </div>
        <div className={styles.fieldGroup}>
          <label className={styles.label}>Height (cm)</label>
          <input
            className={styles.input}
            type="text"
            value={form.height}
            onChange={set("height")}
          />
        </div>
      </div>

      <div className={styles.fieldGroup}>
        <label className={styles.label}>Custom Pickup Location (Shiprocket)</label>
        <input
          className={styles.input}
          type="text"
          placeholder="e.g. Primary or Mumbai-Warehouse (optional)"
          value={form.pickupLocation || ""}
          onChange={set("pickupLocation")}
        />
        <span style={{ fontSize: "11px", color: "var(--text-secondary, #6b7280)", marginTop: "4px", display: "block" }}>
          Leave empty to use universal default pickup location configured in Settings.
        </span>
      </div>

      <label className={styles.checkboxRow}>
        <input
          type="checkbox"
          checked={form.fragile}
          onChange={(event) =>
            dispatch(updateField({ field: "fragile", value: event.target.checked }))
          }
        />
        <span>Mark as fragile while packing</span>
      </label>
    </section>
  );
};

export default ShippingPanel;
