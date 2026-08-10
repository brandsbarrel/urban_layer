import React from "react";
import { Link, useParams } from "react-router-dom";
import styles from "./BlogFormHeader.module.css";

const BlogFormHeader = ({ onPreview, onSaveDraft, onPublish }) => {
  const { id } = useParams();

  return (
    <div className={styles.wrapper}>
      <nav className={styles.breadcrumb}>
        <Link to="/blogs">Blogs</Link>
        <span>/</span>
        <span className={styles.current}>{id ? "Edit Article" : "New Article"}</span>
      </nav>
      <div className={styles.headerRow}>
        <h2 className={styles.title}>{id ? "Edit Article" : "New Blog Article"}</h2>
        <div className={styles.actions}>
          <button className={styles.outlineButton} onClick={onPreview}>
            Preview
          </button>
          <button className={styles.outlineButton} onClick={onSaveDraft}>
            Save Draft
          </button>
          <button className={styles.publishButton} onClick={onPublish}>
            Publish
          </button>
        </div>
      </div>
    </div>
  );
};

export default BlogFormHeader;