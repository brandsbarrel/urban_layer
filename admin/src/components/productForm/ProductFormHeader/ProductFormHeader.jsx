import React from "react";
import { Link, useParams } from "react-router-dom";
import styles from "./ProductFormHeader.module.css";

const ProductFormHeader = ({ onPreview, onSaveDraft, onPublish }) => {
  const { id } = useParams();

  return (
    <div className={styles.wrapper}>
      <div className={styles.headerRow}>
        <div>
          <nav className={styles.breadcrumb}>
            <Link to="/products">Catalog</Link>
            <span>/</span>
            <Link to="/products">Inventory</Link>
            <span>/</span>
            <span className={styles.current}>
              {id ? "Edit Product" : "New Product"}
            </span>
          </nav>
          <h2 className={styles.title}>
            {id ? "Edit Product" : "Add New Product"}
          </h2>
        </div>
        <div className={styles.actions}>
          <button className={styles.outlineButton} onClick={onPreview}>
            Preview
          </button>
          <button className={styles.outlineButton} onClick={onSaveDraft}>
            Save Draft
          </button>
          <button className={styles.publishButton} onClick={onPublish}>
            Publish Product
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductFormHeader;