import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { MdVisibility } from "react-icons/md";
import { openDrawer } from "../../../redux/slices/ordersSlice";
import styles from "./OrdersTable.module.css";

const PAYMENT_CLASS = {
  Paid: "paymentPaid",
  Pending: "paymentPending",
  Failed: "paymentFailed",
  Refunded: "paymentPaid",
  "Partially Refunded": "paymentPending",
  "Refund Processing": "paymentPending",
};

const STATUS_CLASS = {
  Pending: "statusAmber",
  Confirmed: "statusAmber",
  Processing: "statusBlue",
  Packed: "statusBlue",
  Shipped: "statusBlue",
  "Out for Delivery": "statusBlue",
  Delivered: "statusGreen",
  Cancelled: "statusRed",
  "Return Requested": "statusAmber",
  "Return Approved": "statusBlue",
  "Return Rejected": "statusRed",
  Returned: "statusBlue",
  Received: "statusBlue",
  Refunded: "statusGreen",
};

const OrdersTable = () => {
  const dispatch = useDispatch();
  const { items } = useSelector((state) => state.orders);

  return (
    <div className={styles.tableWrapper}>
      <table className={styles.table}>
        <thead>
          <tr className={styles.headRow}>
            <th className={styles.headCell}>Order ID</th>
            <th className={styles.headCell}>Customer</th>
            <th className={styles.headCell}>Amount</th>
            <th className={styles.headCell}>Method</th>
            <th className={styles.headCell}>Payment</th>
            <th className={styles.headCell}>Status</th>
            <th className={styles.headCell}>Shipping</th>
            <th className={styles.headCell}>Courier / AWB</th>
            <th className={`${styles.headCell} ${styles.alignRight}`}>
              Actions
            </th>
          </tr>
        </thead>
        <tbody>
          {items.map((order) => (
            <tr
              key={order.id}
              className={styles.row}
              onClick={() => dispatch(openDrawer(order.id))}
            >
              <td className={styles.cell}>
                <span className={styles.orderId}>#{order.id}</span>
                <p className={styles.orderDate}>{order.placedAt}</p>
              </td>
              <td className={styles.cell}>
                <div className={styles.customerCol}>
                  <img
                    src={order.customer.avatar}
                    alt={order.customer.name}
                    className={styles.avatar}
                  />
                  <div>
                    <p className={styles.customerName}>{order.customer.name}</p>
                    <p className={styles.customerEmail}>{order.customer.email}</p>
                  </div>
                </div>
              </td>
              <td className={styles.cell}>
                <p className={styles.amount}>₹{(order.totalAmount || order.amount || 0).toLocaleString('en-IN')}</p>
              </td>
              <td className={styles.cell}>
                <span className={`${styles.methodBadge} ${order.paymentMethod === "COD" ? styles.methodCod : styles.methodOnline}`}>
                  {order.paymentMethod === "COD" ? "COD" : "Prepaid"}
                </span>
              </td>
              <td className={styles.cell}>
                <span
                  className={`${styles.paymentBadge} ${styles[PAYMENT_CLASS[order.paymentStatus]] || ""}`}
                >
                  {order.paymentStatus}
                </span>
              </td>
              <td className={styles.cell}>
                <span
                  className={`${styles.statusBadge} ${styles[STATUS_CLASS[order.status]] || ""}`}
                >
                  <span className={styles.statusDot} />
                  {order.status}
                </span>
              </td>
              <td className={styles.cell}>
                <span className={styles.shippingLabel}>
                  {order.shippingStatus || "—"}
                </span>
              </td>
              <td className={styles.cell}>
                <div className={styles.courierCol}>
                  {order.shipping?.courierName && (
                    <span className={styles.courierName}>{order.shipping.courierName}</span>
                  )}
                  {order.shipping?.awb && (
                    <span className={styles.awbCode}>{order.shipping.awb}</span>
                  )}
                  {!order.shipping?.courierName && !order.shipping?.awb && (
                    <span className={styles.courierName}>—</span>
                  )}
                </div>
              </td>
              <td className={`${styles.cell} ${styles.alignRight}`}>
                <div
                  className={styles.rowActions}
                  onClick={(e) => e.stopPropagation()}
                >
                  <button
                    className={styles.iconButton}
                    title="View Details"
                    onClick={() => dispatch(openDrawer(order.id))}
                  >
                    <MdVisibility />
                  </button>
                </div>
              </td>
            </tr>
          ))}
          {items.length === 0 && (
            <tr>
              <td colSpan={9} className={styles.emptyCell}>
                No orders match your filters.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default OrdersTable;