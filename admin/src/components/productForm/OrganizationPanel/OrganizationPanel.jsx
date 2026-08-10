import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { MdAdd, MdClose } from "react-icons/md";
import {
  toggleCategory,
  addTag,
  removeTag,
  updateField,
} from "../../../redux/slices/productFormSlice";
import styles from "./OrganizationPanel.module.css";

const AVAILABLE_CATEGORIES = [
  "Phone Cases",
  "Carbon Series",
  "Lifestyle Accessories",
];

const OrganizationPanel = () => {
  const dispatch = useDispatch();
  const form = useSelector((state) => state.productForm.form);
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
      <h4 className={styles.title}>Organization</h4>

      <div className={styles.fieldGroup}>
        <label className={styles.label}>Product Categories</label>
        <div className={styles.checkboxList}>
          {AVAILABLE_CATEGORIES.map((category) => (
            <label key={category} className={styles.checkboxRow}>
              <input
                type="checkbox"
                checked={form.categories.includes(category)}
                onChange={() => dispatch(toggleCategory(category))}
              />
              <span>{category}</span>
            </label>
          ))}
        </div>
        <button className={styles.addLink} title="Integration Required">
          <MdAdd /> Add New Category
        </button>
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
          <option value="Heritage 2024">Heritage 2024</option>
          <option value="Essential Classics">Essential Classics</option>
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