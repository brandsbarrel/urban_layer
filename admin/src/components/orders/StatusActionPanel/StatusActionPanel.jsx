import React from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  NEXT_STATUS,
  ACTION_LABEL,
  advanceStatus,
  approveReturn,
  openCancelModal,
  openRejectReturnModal,
  openRefundModal,
} from "../../../redux/slices/ordersSlice";
import styles from "./StatusActionPanel.module.css";

const StatusActionPanel = ({ order }) => {
  const dispatch = useDispatch();
  const actionLoading = useSelector((state) => state.orders.actionLoading);
  const nextStatus = NEXT_STATUS[order.status];
  const canCancel = ["Pending", "Confirmed"].includes(order.status);
  const isReturnRequested = order.status === "Return Requested";
  const canRefund =
    ["Cancelled", "Returned", "Received", "Return Approved"].includes(order.status) &&
    order.paymentStatus === "Paid";

  const isTerminal = !nextStatus && !canCancel && !isReturnRequested && !canRefund;

  if (isTerminal) {
    return (
      <div className={styles.panel}>
        <p className={styles.terminalNote}>
          {order.status === "Cancelled"
            ? `Cancelled — ${order.cancellationReason || "no reason recorded"}`
            : order.status === "Delivered"
            ? "Order delivered successfully."
            : order.status === "Refunded"
            ? "Order has been refunded."
            : "This order has reached its final status."}
        </p>
      </div>
    );
  }

  const handleAdvance = () => {
    dispatch(advanceStatus({ orderId: order.id }));
  };

  return (
    <div className={styles.panel}>
      <label className={styles.label}>Order Actions</label>
      <div className={styles.buttonRow}>
        {nextStatus && (
          <button
            className={styles.primaryButton}
            onClick={handleAdvance}
            disabled={actionLoading}
          >
            {ACTION_LABEL[nextStatus]}
          </button>
        )}
        {isReturnRequested && (
          <>
            <button
              className={styles.primaryButton}
              onClick={() => dispatch(approveReturn({ orderId: order.id }))}
              disabled={actionLoading}
            >
              Approve Return
            </button>
            <button
              className={styles.dangerButton}
              onClick={() => dispatch(openRejectReturnModal())}
            >
              Reject Return
            </button>
          </>
        )}
        {canRefund && !order.refund && (
          <button
            className={styles.refundButton}
            onClick={() => dispatch(openRefundModal())}
          >
            Process Refund
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