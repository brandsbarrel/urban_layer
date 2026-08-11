import React from "react";
import { useDispatch } from "react-redux";
import {
  NEXT_STATUS,
  ACTION_LABEL,
  advanceStatus,
  openShipModal,
  openCancelModal,
} from "../../../redux/slices/ordersSlice";
import styles from "./StatusActionPanel.module.css";

// Renders only the single valid next action for the order's current status,
// per the workflow's strict status-transition rules (Section 11–18).
const StatusActionPanel = ({ order }) => {
  const dispatch = useDispatch();
  const nextStatus = NEXT_STATUS[order.status];
  const canCancel = order.status === "Pending";

  if (!nextStatus && !canCancel) {
    return (
      <div className={styles.panel}>
        <p className={styles.terminalNote}>
          {order.status === "Cancelled"
            ? `Cancelled — ${order.cancellationReason || "no reason recorded"}`
            : "This order has reached its final status."}
        </p>
      </div>
    );
  }

  const handleAdvance = () => {
    if (nextStatus === "Shipped") {
      dispatch(openShipModal());
      return;
    }
    dispatch(advanceStatus({ orderId: order.id }));
  };

  return (
    <div className={styles.panel}>
      <label className={styles.label}>Order Actions</label>
      <div className={styles.buttonRow}>
        {nextStatus && (
          <button className={styles.primaryButton} onClick={handleAdvance}>
            {ACTION_LABEL[nextStatus]}
          </button>
        )}
        {canCancel && (
          <button
            className={styles.cancelButton}
            onClick={() => dispatch(openCancelModal())}
          >
            Cancel Order
          </button>
        )}
      </div>
    </div>
  );
};

export default StatusActionPanel;