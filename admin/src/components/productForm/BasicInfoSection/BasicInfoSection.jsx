import React from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  MdEditNote,
} from "react-icons/md";
import { updateField } from "../../../redux/slices/productFormSlice";
import { PHONE_MODELS } from "../../../constants/phoneModels";
import styles from "./BasicInfoSection.module.css";

const BasicInfoSection = () => {
  const dispatch = useDispatch();
  const form = useSelector((state) => state.productForm.form);

  const set = (field) => (e) =>
    dispatch(updateField({ field, value: e.target.value }));

  return (
    <section className={styles.card}>
      <div className={styles.headerRow}>
        <h3 className={styles.title}>
          <MdEditNote /> Basic Information
        </h3>
        <span className={styles.requiredBadge}>Required</span>
      </div>

      <div className={styles.fieldGroup}>
        <label className={styles.label}>Product Name</label>
        <input
          className={styles.input}
          type="text"
          placeholder="e.g. Smoke Case for iPhone 16 Pro"
          value={form.name}
          onChange={set("name")}
        />
      </div>

      <div className={styles.twoCol}>
        <div className={styles.fieldGroup}>
          <label className={styles.label}>Phone Model</label>
          <select
            className={styles.input}
            value={form.phoneModel}
            onChange={set("phoneModel")}
          >
            <option value="">Select phone model...</option>
            {PHONE_MODELS.map((phoneModel) => (
              <option key={phoneModel} value={phoneModel}>
                {phoneModel}
              </option>
            ))}
          </select>
        </div>
        <div className={styles.fieldGroup}>
          <label className={styles.label}>SKU Reference</label>
          <input
            className={`${styles.input} ${styles.uppercase}`}
            type="text"
            placeholder="ULC-CRB-001"
            value={form.sku}
            onChange={set("sku")}
          />
        </div>
      </div>

      <div className={styles.fieldGroup}>
        <label className={styles.label}>Description</label>
        <textarea
          className={styles.textarea}
          rows={5}
          placeholder="Short product details, finish, grip, protection level..."
          value={form.description}
          onChange={set("description")}
        />
      </div>
    </section>
  );
};

export default BasicInfoSection;
