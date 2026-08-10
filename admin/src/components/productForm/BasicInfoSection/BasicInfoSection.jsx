import React from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  MdEditNote,
  MdFormatBold,
  MdFormatItalic,
  MdList,
  MdLink,
  MdAutoAwesome,
} from "react-icons/md";
import { updateField } from "../../../redux/slices/productFormSlice";
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
          placeholder="e.g. Heritage Carbon Fiber Case"
          value={form.name}
          onChange={set("name")}
        />
      </div>

      <div className={styles.twoCol}>
        <div className={styles.fieldGroup}>
          <label className={styles.label}>Slug (URL)</label>
          <div className={styles.slugRow}>
            <span className={styles.slugPrefix}>urbanlayers.co/p/</span>
            <input
              className={styles.slugInput}
              type="text"
              placeholder="heritage-carbon-case"
              value={form.slug}
              onChange={set("slug")}
            />
          </div>
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
        <div className={styles.editorBox}>
          <div className={styles.toolbar}>
            <button type="button" className={styles.toolbarButton} disabled title="Coming Soon">
              <MdFormatBold />
            </button>
            <button type="button" className={styles.toolbarButton} disabled title="Coming Soon">
              <MdFormatItalic />
            </button>
            <button type="button" className={styles.toolbarButton} disabled title="Coming Soon">
              <MdList />
            </button>
            <button type="button" className={styles.toolbarButton} disabled title="Coming Soon">
              <MdLink />
            </button>
            <div className={styles.spacer} />
            <button type="button" className={styles.aiButton} disabled title="Coming Soon">
              <MdAutoAwesome /> AI ASSIST
            </button>
          </div>
          <textarea
            className={styles.textarea}
            rows={6}
            placeholder="Craft a luxury story for this product..."
            value={form.description}
            onChange={set("description")}
          />
        </div>
      </div>
    </section>
  );
};

export default BasicInfoSection;