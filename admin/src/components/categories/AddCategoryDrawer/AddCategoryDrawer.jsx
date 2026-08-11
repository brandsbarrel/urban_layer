import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { MdClose } from "react-icons/md";
import {
  closeDrawer,
  addCategory,
  updateCategory,
} from "../../../redux/slices/categoriesSlice";
import styles from "./AddCategoryDrawer.module.css";

const emptyForm = {
  name: "",
  slug: "",
  description: "",
  phoneModels: "",
};

const AddCategoryDrawer = () => {
  const dispatch = useDispatch();
  const { drawerOpen: isOpen, editingId, items } = useSelector((state) => state.categories);
  const editingCategory = items.find((category) => category.id === editingId);
  const [form, setForm] = useState(emptyForm);
  const [error, setError] = useState("");

  React.useEffect(() => {
    if (editingCategory) {
      setForm({
        name: editingCategory.name || "",
        slug: (editingCategory.slug || "").replace(/^\//, ""),
        description: editingCategory.description || "",
        phoneModels: (editingCategory.phoneModels || []).join(", "),
      });
    } else if (isOpen) {
      setForm(emptyForm);
    }
  }, [editingCategory, isOpen]);

  const set = (field) => (e) =>
    setForm((prev) => ({ ...prev, [field]: e.target.value }));

  const slugify = (value) =>
    value
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-");

  const handleClose = () => {
    setForm(emptyForm);
    setError("");
    dispatch(closeDrawer());
  };

  const handleSave = () => {
    if (!form.name.trim()) {
      setError("Case style name is required.");
      return;
    }
    const payload = {
        name: form.name.trim(),
        slug: form.slug.trim() || slugify(form.name),
        description: form.description.trim(),
        phoneModels: form.phoneModels
          .split(",")
          .map((phone) => phone.trim())
          .filter(Boolean),
      };

    if (editingCategory) {
      dispatch(updateCategory({ id: editingCategory.id, ...payload }));
    } else {
      dispatch(addCategory(payload));
    }
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
            <h3 className={styles.title}>{editingCategory ? "Edit Case Style" : "Add Case Style"}</h3>
            <p className={styles.subtitle}>
              Add case styles like Smoke Case, Leather Case, Clear Case, or MagSafe Case.
            </p>
          </div>
          <button className={styles.closeButton} onClick={handleClose}>
            <MdClose />
          </button>
        </div>

        <div className={styles.body}>
          <div className={styles.section}>
            <h4 className={styles.sectionLabel}>Case Style</h4>
            <div className={styles.grid}>
              <div className={styles.fullWidth}>
                <label className={styles.label}>Case Style Name</label>
                <input
                  className={styles.input}
                  type="text"
                  placeholder="e.g. Smoke Case"
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
                    placeholder={slugify(form.name) || "smoke-case"}
                    value={form.slug}
                    onChange={set("slug")}
                  />
                </div>
              </div>
              <div className={styles.fullWidth}>
                <label className={styles.label}>Description</label>
                <textarea
                  className={styles.textarea}
                  rows={3}
                  placeholder="Optional notes for this case style..."
                  value={form.description}
                  onChange={set("description")}
                />
              </div>
              <div className={styles.fullWidth}>
                <label className={styles.label}>Phone Names</label>
                <textarea
                  className={styles.textarea}
                  rows={3}
                  placeholder="iPhone 16 Pro, Samsung S25 Ultra, OnePlus 13"
                  value={form.phoneModels}
                  onChange={set("phoneModels")}
                />
              </div>
            </div>
          </div>

          {error && <p className={styles.error}>{error}</p>}
        </div>

        <div className={styles.footer}>
          <button className={styles.discardButton} onClick={handleClose}>
            Discard
          </button>
          <button className={styles.saveButton} onClick={handleSave}>
            {editingCategory ? "Save Changes" : "Save Case Style"}
          </button>
        </div>
      </div>
    </>
  );
};

export default AddCategoryDrawer;
