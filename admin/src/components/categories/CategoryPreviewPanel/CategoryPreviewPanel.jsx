import React from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import styles from "./CategoryPreviewPanel.module.css";

const CategoryPreviewPanel = () => {
  const navigate = useNavigate();
  const preview = useSelector((state) => state.categories.previewCategory);

  return (
    <aside className={styles.panel}>
      <div className={styles.hero}>
        <img src={preview.heroImage} alt="Category insight" />
        <div className={styles.heroOverlay}>
          <h3>Category Insight</h3>
        </div>
      </div>
      <div className={styles.body}>
        <div>
          <p className={styles.sectionLabel}>Live Performance</p>
          <div className={styles.statRow}>
            <span>Revenue</span>
            <span className={styles.statValue}>{preview.revenue}</span>
          </div>
          <div className={styles.statRow}>
            <span>Active Orders</span>
            <span className={styles.statValue}>{preview.activeOrders}</span>
          </div>
          <div className={`${styles.statRow} ${styles.statRowLast}`}>
            <span>Avg. Ticket</span>
            <span className={styles.statValue}>{preview.avgTicket}</span>
          </div>
        </div>
        <div>
          <p className={styles.sectionLabel}>Growth Index</p>
          <div className={styles.growthChart}>
            {preview.growthIndex.map((value, index) => (
              <div
                key={index}
                className={
                  index === preview.growthIndex.length - 1
                    ? styles.growthBarActive
                    : styles.growthBar
                }
                style={{ height: `${value}%` }}
              />
            ))}
          </div>
          <p className={styles.growthCaption}>Last 5 Months Data</p>
        </div>
        <button
          className={styles.catalogButton}
          onClick={() => navigate("/products")}
        >
          View Product Catalog
        </button>
      </div>
    </aside>
  );
};

export default CategoryPreviewPanel;