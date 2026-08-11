import React from "react";
import { useSelector } from "react-redux";
import { MdInventory, MdWarning, MdError } from "react-icons/md";
import styles from "./InventoryStatus.module.css";

const ICON_MAP = {
  inventory: MdInventory,
  warning: MdWarning,
  error: MdError,
};

const InventoryStatus = () => {
  const inventoryStatus = useSelector(
    (state) => state.dashboard.inventoryStatus
  );

  return (
    <div className={styles.card}>
      <h3 className={styles.title}>Inventory Status</h3>
      <div className={styles.rows}>
        {inventoryStatus.map((item) => {
          const Icon = ICON_MAP[item.icon];
          return (
            <div key={item.id} className={styles.row}>
              <div className={`${styles.iconWrapper} ${styles[item.tone]}`}>
                <Icon />
              </div>
              <div className={styles.textGroup}>
                <p className={styles.label}>{item.label}</p>
                <p className={styles.sub}>{item.sub}</p>
              </div>
              <span className={styles.percent}>{item.percent}</span>
            </div>
          );
        })}
        <button
          type="button"
          className={styles.reportButton}
          title="Integration Required"
        >
          Generate Report
        </button>
      </div>
    </div>
  );
};

export default InventoryStatus;