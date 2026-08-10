import React from "react";
import styles from "./ShippingInfoCard.module.css";

const ShippingInfoCard = ({ shipping }) => {
  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <h4 className={styles.title}>Shipping Information</h4>
        <button className={styles.editButton} title="Coming Soon">
          Edit
        </button>
      </div>
      <div className={styles.rows}>
        <div className={styles.row}>
          <span className={styles.label}>Recipient</span>
          <span className={styles.value}>{shipping.recipient}</span>
        </div>
        <div className={styles.row}>
          <span className={styles.label}>Address</span>
          <span className={styles.valueRight}>{shipping.address}</span>
        </div>
        <div className={styles.row}>
          <span className={styles.label}>Carrier</span>
          <span className={styles.value}>{shipping.carrier}</span>
        </div>
        {shipping.trackingNumber && (
          <div className={styles.row}>
            <span className={styles.label}>Tracking #</span>
            <span className={styles.value}>{shipping.trackingNumber}</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default ShippingInfoCard;