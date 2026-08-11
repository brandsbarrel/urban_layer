import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { MdAutoAwesome } from "react-icons/md";
import { LuSearchCheck } from "react-icons/lu";
import { updateField } from "../../../redux/slices/productFormSlice";
import styles from "./SEOSection.module.css";

const SEOSection = () => {
  const dispatch = useDispatch();
  const form = useSelector((state) => state.productForm.form);

  const set = (field) => (e) =>
    dispatch(updateField({ field, value: e.target.value }));

  return (
    <section className={styles.card}>
      <div className={styles.headerRow}>
        <h3 className={styles.title}>
          <LuSearchCheck /> SEO Optimization
        </h3>
        <button className={styles.generateButton} title="Coming Soon">
          <MdAutoAwesome /> Generate Meta
        </button>
      </div>

      <div className={styles.previewBox}>
        <p className={styles.previewUrl}>
          urbanlayers.co › products › {form.slug || "product-slug"}
        </p>
        <h4 className={styles.previewTitle}>
          {form.seoTitle || "SEO title will appear here"}
        </h4>
        <p className={styles.previewDescription}>
          {form.seoDescription || "Meta description will appear here."}
        </p>
      </div>

      <div className={styles.fieldGroup}>
        <label className={styles.label}>SEO Title Tag (65 chars max)</label>
        <input
          className={styles.input}
          type="text"
          maxLength={65}
          value={form.seoTitle}
          onChange={set("seoTitle")}
        />
      </div>
      <div className={styles.fieldGroup}>
        <label className={styles.label}>
          Meta Description (160 chars max)
        </label>
        <textarea
          className={styles.textarea}
          rows={3}
          maxLength={160}
          value={form.seoDescription}
          onChange={set("seoDescription")}
        />
      </div>
    </section>
  );
};

export default SEOSection;