import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { MdRefresh, MdOpenInNew } from "react-icons/md";
import { refreshTracking } from "../../../redux/slices/ordersSlice";
import styles from "./ShippingInfoCard.module.css";

const ShippingInfoCard = ({ shipping = {}, orderId }) => {
  const dispatch = useDispatch();
  const actionLoading = useSelector((state) => state.orders.actionLoading);

  const awb = shipping.awb || shipping.trackingNumber;
  const carrier = shipping.courierName || shipping.carrier || "Standard Carrier";
  const trackingUrl = shipping.shiprocketTrackingUrl;

  const handleRefresh = () => {
    if (orderId) {
      dispatch(refreshTracking({ orderId }));
    }
  };

  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <h4 className={styles.title}>Shipment & Delivery</h4>
        {awb && (
          <button
            className={styles.refreshButton}
            onClick={handleRefresh}
            disabled={actionLoading}
            title="Sync latest scan updates from courier"
          >
            <MdRefresh className={styles.refreshIcon} /> Sync
          </button>
        )}
      </div>
      <div className={styles.rows}>
        <div className={styles.row}>
          <span className={styles.label}>Recipient</span>
          <span className={styles.value}>{shipping.recipient || "N/A"}</span>
        </div>
        <div className={styles.row}>
          <span className={styles.label}>Address</span>
          <span className={styles.valueRight}>{shipping.address || "N/A"}</span>
        </div>
        <div className={styles.row}>
          <span className={styles.label}>Courier</span>
          <span className={styles.value}>{carrier}</span>
        </div>
        {awb && (
          <div className={styles.row}>
            <span className={styles.label}>AWB / Tracking</span>
            <span className={styles.valueMono}>
              {awb}
              {trackingUrl && (
                <a
                  href={trackingUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.trackLink}
                  title="Open live tracking page"
                >
                  <MdOpenInNew />
                </a>
              )}
            </span>
          </div>
        )}
        {shipping.currentStatus && (
          <div className={styles.row}>
            <span className={styles.label}>Shipping Status</span>
            <span className={styles.badge}>{shipping.currentStatus}</span>
          </div>
        )}
        {shipping.estimatedDeliveryDate && (
          <div className={styles.row}>
            <span className={styles.label}>Est. Delivery</span>
            <span className={styles.value}>
              {new Date(shipping.estimatedDeliveryDate).toLocaleDateString("en-IN", {
                month: "short",
                day: "numeric",
                year: "numeric"
              })}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default ShippingInfoCard;