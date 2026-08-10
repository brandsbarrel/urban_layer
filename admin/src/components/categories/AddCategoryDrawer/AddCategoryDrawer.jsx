import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { MdClose } from "react-icons/md";
import {
  closeDrawer,
  addCategory,
} from "../../../redux/slices/categoriesSlice";
import styles from "./AddCategoryDrawer.module.css";

const emptyForm = {
  name: "",
  slug: "",
  parent: "None (Root)",
  description: "",
  seoTitle: "",
  seoDescription: "",
};

const AddCategoryDrawer = () => {
  const dispatch = useDispatch();
  const isOpen = useSelector((state) => state.categories.drawerOpen);
  const [form, setForm] = useState(emptyForm);
  const [error, setError] = useState("");

  const set = (field) => (e) =>
    setForm((prev) => ({ ...prev, [field]: e.target.value }));

  const handleClose = () => {
    setForm(emptyForm);
    setError("");
    dispatch(closeDrawer());
  };

  const handleSave = () => {
    if (!form.name.trim() || !form.slug.trim()) {
      setError("Category Name and Slug are required.");
      return;
    }
    dispatch(
      addCategory({
        name: form.name.trim(),
        slug: `/${form.slug.trim()}`,
        parent: form.parent,
      })
    );
    setForm(emptyForm);
    setError("");
  };

  return (
    <>
      <div
        className={`${styles.overlay} ${isOpen ? styles.overlayOpen : ""}`}
        onClick={handleClose}
      />
      <div className={`${styles.drawer} ${isOpen ? styles.drawerOpen : ""}`}>
        <div className={styles.header}>
          <div>
            <h3 className={styles.title}>Add Category</h3>
            <p className={styles.subtitle}>
              Create a new organizational node in your hierarchy.
            </p>
          </div>
          <button className={styles.closeButton} onClick={handleClose}>
            <MdClose />
          </button>
        </div>

        <div className={styles.body}>
          <div className={styles.section}>
            <h4 className={styles.sectionLabel}>Basic Configuration</h4>
            <div className={styles.grid}>
              <div className={styles.fullWidth}>
                <label className={styles.label}>Category Name</label>
                <input
                  className={styles.input}
                  type="text"
                  placeholder="e.g. Leather Goods"
                  value={form.name}
                  onChange={set("name")}
                />
              </div>
              <div>
                <label className={styles.label}>Slug</label>
                <div className={styles.slugRow}>
                  <span className={styles.slugPrefix}>/</span>
                  <input
                    className={styles.slugInput}
                    type="text"
                    placeholder="leather-goods"
                    value={form.slug}
                    onChange={set("slug")}
                  />
                </div>
              </div>
              <div>
                <label className={styles.label}>Parent Category</label>
                <select
                  className={styles.select}
                  value={form.parent}
                  onChange={set("parent")}
                >
                  <option>None (Root)</option>
                  <option>Accessories</option>
                  <option>Apparel</option>
                </select>
              </div>
              <div className={styles.fullWidth}>
                <label className={styles.label}>Description</label>
                <textarea
                  className={styles.textarea}
                  rows={3}
                  placeholder="Brief overview for internal and external use..."
                  value={form.description}
                  onChange={set("description")}
                />
              </div>
            </div>
          </div>

          <div className={styles.section}>
            <h4 className={styles.sectionLabel}>
              Search Engine Optimization
            </h4>
            <div className={styles.fieldGroup}>
              <label className={styles.label}>Meta Title</label>
              <input
                className={styles.input}
                type="text"
                value={form.seoTitle}
                onChange={set("seoTitle")}
              />
            </div>
            <div className={styles.fieldGroup}>
              <label className={styles.label}>Meta Description</label>
              <textarea
                className={styles.textarea}
                rows={2}
                value={form.seoDescription}
                onChange={set("seoDescription")}
              />
            </div>
            <div className={styles.googlePreview}>
              <p className={styles.previewLabel}>Google Search Preview</p>
              <p className={styles.previewTitle}>
                {form.seoTitle || `${form.name || "Category Name"} | Urban Layers Co.`}
              </p>
              <p className={styles.previewUrl}>
                https://urbanlayers.co/shop/{form.slug || "your-slug"}
              </p>
              <p className={styles.previewDescription}>
                {form.seoDescription ||
                  "Meta description will appear here once entered."}
              </p>
            </div>
          </div>

          {error && <p className={styles.error}>{error}</p>}
        </div>

        <div className={styles.footer}>
          <button className={styles.discardButton} onClick={handleClose}>
            Discard
          </button>
          <button className={styles.saveButton} onClick={handleSave}>
            Save Category
          </button>
        </div>
      </div>
    </>
  );
};

export default AddCategoryDrawer;