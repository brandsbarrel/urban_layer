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
      <h4 className={styles.title}>Shipping Details</h4>

      <div className={styles.fieldGroup}>
        <label className={styles.label}>Weight (kg)</label>
        <input
          className={styles.input}
          type="text"
          value={form.weight}
          onChange={set("weight")}
        />
      </div>

      <div className={styles.threeCol}>
        <div className={styles.fieldGroup}>
          <label className={styles.label}>Length</label>
          <input
            className={styles.input}
            type="text"
            value={form.length}
            onChange={set("length")}
          />
        </div>
        <div className={styles.fieldGroup}>
          <label className={styles.label}>Width</label>
          <input
            className={styles.input}
            type="text"
            value={form.width}
            onChange={set("width")}
          />
        </div>
        <div className={styles.fieldGroup}>
          <label className={styles.label}>Height</label>
          <input
            className={styles.input}
            type="text"
            value={form.height}
            onChange={set("height")}
          />
        </div>
      </div>
    </section>
  );
};

export default ShippingPanel;