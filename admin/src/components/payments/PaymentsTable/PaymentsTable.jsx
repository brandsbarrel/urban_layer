import React from "react";
import { useSelector } from "react-redux";
import { PAYMENT_STATUS_TONE } from "../../../redux/slices/paymentsSlice";
import styles from "./PaymentsTable.module.css";

const PAYMENT_STATUS_TONE_CLASS = {
  green: "toneGreen",
  amber: "toneAmber",
  red: "toneRed",
  blue: "toneBlue",
};

const PAYMENT_METHOD_CLASS = {
  COD: "methodCod",
  Online: "methodOnline",
  Razorpay: "methodOnline",
};

const PaymentsTable = () => {
  const { items } = useSelector((state) => state.payments);

  return (
    <div className={styles.tableWrapper}>
      <table className={styles.table}>
        <thead>
          <tr className={styles.headRow}>
            <th className={styles.headCell}>Payment ID</th>
            <th className={styles.headCell}>Order ID</th>
            <th className={styles.headCell}>Customer</th>
            <th className={styles.headCell}>Amount</th>
            <th className={styles.headCell}>Method</th>
            <th className={styles.headCell}>Status</th>
            <th className={styles.headCell}>Gateway</th>
            <th className={styles.headCell}>Date</th>
            <th className={`${styles.headCell} ${styles.alignRight}`}>
              Actions
            </th>
          </tr>
        </thead>
        <tbody>
          {items.map((payment) => (
            <tr
              key={payment.id}
              className={styles.row}
              onClick={() => window.dispatchEvent(new CustomEvent("openPaymentDrawer", { detail: payment.id }))}
            >
              <td className={styles.cell}>
                <span className={styles.paymentId}>
                  {payment.paymentGatewayPaymentId ? `pay_${payment.paymentGatewayPaymentId.slice(-8)}` : `#${payment.id.slice(-8)}`}
                </span>
              </td>
              <td className={styles.cell}>
                <span className={styles.orderId}>#{payment.orderNumber}</span>
              </td>
              <td className={styles.cell}>
                <div className={styles.customerCol}>
                  <img
                    src={payment.customer.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100"}
                    alt={payment.customer.name}
                    className={styles.avatar}
                  />
                  <div>
                    <p className={styles.customerName}>{payment.customer.name}</p>
                    <p className={styles.customerEmail}>{payment.customer.email}</p>
                  </div>
                </div>
              </td>
              <td className={styles.cell}>
                <p className={styles.amount}>
                  ₹{payment.amount.toLocaleString('en-IN')}
                </p>
              </td>
              <td className={styles.cell}>
                <span className={`${styles.methodBadge} ${styles[PAYMENT_METHOD_CLASS[payment.paymentMethod]] || styles.methodOnline}`}>
                  {payment.paymentMethod === "COD" ? "COD" : "Prepaid"}
                </span>
              </td>
              <td className={styles.cell}>
                <span
                  className={`${styles.paymentBadge} ${styles[PAYMENT_STATUS_TONE_CLASS[PAYMENT_STATUS_TONE[payment.paymentStatus]] || ""]}`}
                >
                  {payment.paymentStatus}
                </span>
              </td>
              <td className={styles.cell}>
                <span className={styles.gatewayBadge}>
                  {payment.paymentGateway || "Razorpay"}
                </span>
              </td>
              <td className={styles.cell}>
                <span className={styles.dateLabel}>{payment.placedAt}</span>
              </td>
              <td className={`${styles.cell} ${styles.alignRight}`}>
                <div
                  className={styles.rowActions}
                  onClick={(e) => e.stopPropagation()}
                >
                  <button
                    className={styles.iconButton}
                    title="View Details"
                    onClick={() => window.dispatchEvent(new CustomEvent("openPaymentDrawer", { detail: payment.id }))}
                  >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                      <circle cx="12" cy="12" r="3" />
                    </svg>
                  </button>
                </div>
              </td>
            </tr>
          ))}
          {items.length === 0 && (
            <tr>
              <td colSpan={9} className={styles.emptyCell}>
                No payments match your filters.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default PaymentsTable;