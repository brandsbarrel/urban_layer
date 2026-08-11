import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { closeCancelModal, cancelOrder } from "../../../redux/slices/ordersSlice";
import styles from "./CancelOrderModal.module.css";

const REASONS = [
  "Customer Request",
  "Out of Stock",
  "Payment Issue",
  "Fraud",
  "Other",
];

// Section 18: Cancel Order requires a Cancellation Reason and confirmation.
const CancelOrderModal = ({ orderId, paymentMethod }) => {
  const dispatch = useDispatch();
  const open = useSelector((state) => state.orders.cancelModalOpen);
  const [reason, setReason] = useState(REASONS[0]);
  const [error, setError] = useState("");

  if (!open) return null;

  const refundNote =
    paymentMethod && paymentMethod.toLowerCase() !== "cod"
      ? "This order was prepaid — a refund will be required."
      : "This order was Cash on Delivery — no refund is required unless payment was already collected.";

  const handleConfirm = () => {
    if (!reason) {
      setError("Please select a cancellation reason.");
      return;
    }
    dispatch(cancelOrder({ orderId, reason }));
    setError("");
  };

  return (
    <div className={styles.overlay} onClick={() => dispatch(closeCancelModal())}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <h3 className={styles.title}>Cancel this order?</h3>
        <p className={styles.warning}>
          Are you sure? This action may affect store data.
        </p>
        <div className={styles.field}>
          <label>Cancellation Reason</label>
          <select value={reason} onChange={(e) => setReason(e.target.value)}>
            {REASONS.map((r) => (
              <option key={r}>{r}</option>
            ))}
          </select>
        </div>
        <p className={styles.refundNote}>{refundNote}</p>
        {error && <p className={styles.error}>{error}</p>}
        <div className={styles.actions}>
          <button
            className={styles.cancelButton}
            onClick={() => dispatch(closeCancelModal())}
          >
            Cancel
          </button>
          <button className={styles.confirmButton} onClick={handleConfirm}>
            Confirm Cancellation
          </button>
        </div>
      </div>
    </div>
  );
};

export default CancelOrderModal;