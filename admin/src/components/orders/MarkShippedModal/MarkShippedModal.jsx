import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  closeShipModal,
  advanceStatus,
  setShippingInfo,
} from "../../../redux/slices/ordersSlice";
import styles from "./MarkShippedModal.module.css";

// Section 15: Mark Shipped requires Courier Partner, Tracking Number,
// and Shipping Method before the transition is allowed.
const MarkShippedModal = ({ orderId }) => {
  const dispatch = useDispatch();
  const open = useSelector((state) => state.orders.shipModalOpen);
  const [courier, setCourier] = useState("");
  const [tracking, setTracking] = useState("");
  const [method, setMethod] = useState("Standard");
  const [error, setError] = useState("");

  if (!open) return null;

  const handleConfirm = () => {
    if (!courier.trim() || !tracking.trim()) {
      setError("Courier Partner and Tracking Number are required.");
      return;
    }
    dispatch(setShippingInfo({ orderId, carrier: courier, trackingNumber: tracking, shippingMethod: method }));
    dispatch(advanceStatus({ orderId, timelineNote: `Carrier: ${courier} (Tracking: ${tracking})` }));
    dispatch(closeShipModal());
    setCourier("");
    setTracking("");
    setError("");
  };

  return (
    <div className={styles.overlay} onClick={() => dispatch(closeShipModal())}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <h3 className={styles.title}>Mark as Shipped</h3>
        <div className={styles.field}>
          <label>Courier Partner</label>
          <input
            type="text"
            value={courier}
            onChange={(e) => setCourier(e.target.value)}
            placeholder="e.g. DHL Express"
          />
        </div>
        <div className={styles.field}>
          <label>Tracking Number</label>
          <input
            type="text"
            value={tracking}
            onChange={(e) => setTracking(e.target.value)}
            placeholder="e.g. #98421034293"
          />
        </div>
        <div className={styles.field}>
          <label>Shipping Method</label>
          <select value={method} onChange={(e) => setMethod(e.target.value)}>
            <option>Standard</option>
            <option>Express</option>
            <option>Priority</option>
          </select>
        </div>
        {error && <p className={styles.error}>{error}</p>}
        <div className={styles.actions}>
          <button
            className={styles.cancelButton}
            onClick={() => dispatch(closeShipModal())}
          >
            Cancel
          </button>
          <button className={styles.confirmButton} onClick={handleConfirm}>
            Confirm Shipment
          </button>
        </div>
      </div>
    </div>
  );
};

export default MarkShippedModal;
