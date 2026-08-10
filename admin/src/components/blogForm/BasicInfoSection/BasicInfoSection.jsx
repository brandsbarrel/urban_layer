import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { MdClose } from "react-icons/md";
import { updateField, addTag, removeTag } from "../../../redux/slices/blogFormSlice";
import styles from "./BasicInfoSection.module.css";

const BasicInfoSection = () => {
  const dispatch = useDispatch();
  const form = useSelector((state) => state.blogForm.form);
  const [tagInput, setTagInput] = useState("");

  const set = (field) => (e) => dispatch(updateField({ field, value: e.target.value }));

  const handleTagKeyDown = (e) => {
    if (e.key === "Enter" && tagInput.trim()) {
      e.preventDefault();
      dispatch(addTag(tagInput));
      setTagInput("");
    }
  };

  return (
    <section className={styles.card}>
      <h3 className={styles.title}>Article Details</h3>

      <div className={styles.fieldGroup}>
        <label className={styles.label}>Title</label>
        <input
          className={styles.input}
          type="text"
          placeholder="e.g. Heritage Leather: The 2024 Collection"
          value={form.title}
          onChange={set("title")}
        />
      </div>

      <div className={styles.twoCol}>
        <div className={styles.fieldGroup}>
          <label className={styles.label}>Slug</label>
          <input
            className={styles.input}
            type="text"
            placeholder="heritage-leather-2024"
            value={form.slug}
            onChange={set("slug")}
          />
        </div>
        <div className={styles.fieldGroup}>
          <label className={styles.label}>Category</label>
          <select className={styles.input} value={form.category} onChange={set("category")}>
            <option value="">Select a category...</option>
            <option value="Craftsmanship">Craftsmanship</option>
            <option value="Lifestyle">Lifestyle</option>
            <option value="Innovation">Innovation</option>
          </select>
        </div>
      </div>

      <div className={styles.fieldGroup}>
        <label className={styles.label}>Content</label>
        <textarea
          className={styles.textarea}
          rows={10}
          placeholder="Write the article content here..."
          value={form.content}
          onChange={set("content")}
        />
      </div>

      <div className={styles.fieldGroup}>
        <label className={styles.label}>Tags</label>
        <div className={styles.tagList}>
          {form.tags.map((tag) => (
            <span key={tag} className={styles.tag}>
              #{tag}
              <button type="button" onClick={() => dispatch(removeTag(tag))} aria-label={`Remove tag ${tag}`}>
                <MdClose />
              </button>
            </span>
          ))}
        </div>
        <input
          className={styles.input}
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

export default BasicInfoSection;