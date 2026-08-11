import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { MdClose } from "react-icons/md";
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
        <label className={styles.label}>Tags</label>
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
