import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { MdClose, MdStar } from "react-icons/md";
import {
  toggleCategory,
  addTag,
  removeTag,
  updateField,
} from "../../../redux/slices/productFormSlice";
import styles from "./OrganizationPanel.module.css";

const OrganizationPanel = () => {
  const dispatch = useDispatch();
  const form = useSelector((state) => state.productForm.form);
  const categories = useSelector((state) => state.categories.items);
  const [tagInput, setTagInput] = useState("");

  const handleTagKeyDown = (e) => {
    if (e.key === "Enter" && tagInput.trim()) {
      e.preventDefault();
      dispatch(addTag(tagInput));
      setTagInput("");
    }
  };

  const isBestSeller = form.tags.includes("best-seller");

  return (
    <section className={styles.card}>
      <h4 className={styles.title}>Case Details</h4>

      <div className={styles.fieldGroup}>
        <label className={styles.label}>Case Style</label>
        <div className={styles.checkboxList}>
          {categories.map((category) => (
            <label key={category.id} className={styles.checkboxRow}>
              <input
                type="checkbox"
                checked={form.categories.includes(category.id)}
                onChange={() => dispatch(toggleCategory(category.id))}
              />
              <span>{category.name}</span>
            </label>
          ))}
          {categories.length === 0 && (
            <span className={styles.label}>Add case styles from Categories first.</span>
          )}
        </div>
      </div>

      <div className={styles.fieldGroup}>
        <label className={styles.label}>Collection</label>
        <select
          className={styles.select}
          value={form.collection}
          onChange={(e) =>
            dispatch(
              updateField({ field: "collection", value: e.target.value })
            )
          }
        >
          <option value="">Select a collection...</option>
          <option value="Urban Basics">Urban Basics</option>
          <option value="Premium Protection">Premium Protection</option>
          <option value="Limited Drop">Limited Drop</option>
        </select>
      </div>

      <div className={styles.fieldGroup}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "4px" }}>
          <label className={styles.label} style={{ margin: 0 }}>Tags</label>
          <button
            type="button"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "4px",
              fontSize: "12px",
              padding: "4px 8px",
              borderRadius: "4px",
              border: "1px solid #ca8a04",
              background: isBestSeller ? "#fef9c3" : "#ffffff",
              color: isBestSeller ? "#854d0e" : "#555",
              cursor: "pointer",
              fontWeight: 600
            }}
            onClick={() => {
              if (isBestSeller) {
                dispatch(removeTag("best-seller"));
              } else {
                dispatch(addTag("best-seller"));
              }
            }}
          >
            <MdStar style={{ color: "#ca8a04" }} />
            {isBestSeller ? "Best Seller (Active)" : "Mark as Best Seller"}
          </button>
        </div>
        <div className={styles.tagList}>
          {form.tags.map((tag) => (
            <span key={tag} className={styles.tag}>
              {tag}
              <button
                type="button"
                onClick={() => dispatch(removeTag(tag))}
                aria-label={`Remove tag ${tag}`}
              >
                <MdClose />
              </button>
            </span>
          ))}
        </div>
        <input
          className={styles.tagInput}
          type="text"
          placeholder="Type tag and press enter..."
          value={tagInput}
          onChange={(e) => setTagInput(e.target.value)}
          onKeyDown={handleTagKeyDown}
        />
      </div>
    </section>
  );
};

export default OrganizationPanel;
