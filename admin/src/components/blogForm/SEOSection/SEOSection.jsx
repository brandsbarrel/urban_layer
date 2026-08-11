import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { updateField } from "../../../redux/slices/blogFormSlice";
import styles from "./SEOSection.module.css";

const SEOSection = () => {
  const dispatch = useDispatch();
  const form = useSelector((state) => state.blogForm.form);

  const set = (field) => (e) => dispatch(updateField({ field, value: e.target.value }));

  return (
    <section className={styles.card}>
      <h3 className={styles.title}>SEO</h3>
      <div className={styles.previewBox}>
        <p className={styles.previewUrl}>urbanlayers.co/blog/{form.slug || "article-slug"}</p>
        <h4 className={styles.previewTitle}>{form.seoTitle || form.title || "SEO title will appear here"}</h4>
        <p className={styles.previewDescription}>
          {form.seoDescription || "Meta description will appear here."}
        </p>
      </div>
      <div className={styles.fieldGroup}>
        <label className={styles.label}>SEO Title Tag</label>
        <input className={styles.input} type="text" value={form.seoTitle} onChange={set("seoTitle")} />
      </div>
      <div className={styles.fieldGroup}>
        <label className={styles.label}>Meta Description</label>
        <textarea className={styles.textarea} rows={3} value={form.seoDescription} onChange={set("seoDescription")} />
      </div>
    </section>
  );
};

export default SEOSection;