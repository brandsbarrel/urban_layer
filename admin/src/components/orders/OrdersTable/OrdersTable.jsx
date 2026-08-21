import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { MdVisibility, MdEdit, MdDownload } from "react-icons/md";
import { openDrawer } from "../../../redux/slices/ordersSlice";
import styles from "./OrdersTable.module.css";

const PAYMENT_CLASS = {
  Paid: "paymentPaid",
  Pending: "paymentPending",
  Failed: "paymentFailed",
};

const STATUS_CLASS = {
  Pending: "statusAmber",
  Confirmed: "statusAmber",
  Packed: "statusBlue",
  Shipped: "statusBlue",
  "Out for Delivery": "statusBlue",
  Delivered: "statusGreen",
  Cancelled: "statusRed",
};

const OrdersTable = () => {
  const dispatch = useDispatch();
  const { items, statusFilter, paymentFilter, searchQuery } = useSelector(
    (state) => state.orders
  );

  const query = searchQuery.trim().toLowerCase();
  const filtered = items.filter((order) => {
    const matchesStatus = statusFilter === "All" || order.status === statusFilter;
    const matchesPayment =
      paymentFilter === "All" || order.paymentStatus === paymentFilter;
    const matchesQuery =
      !query ||
      order.id.toLowerCase().includes(query) ||
      order.customer.name.toLowerCase().includes(query);
    return matchesStatus && matchesPayment && matchesQuery;
  });

  return (
    <div className={styles.tableWrapper}>
      <table className={styles.table}>
        <thead>
          <tr className={styles.headRow}>
            <th className={styles.headCell}>Order ID</th>
            <th className={styles.headCell}>Customer</th>
            <th className={styles.headCell}>Products</th>
            <th className={styles.headCell}>Amount</th>
            <th className={styles.headCell}>Payment</th>
            <th className={styles.headCell}>Status</th>
            <th className={`${styles.headCell} ${styles.alignRight}`}>
              Actions
            </th>
          </tr>
        </thead>
        <tbody>
          {filtered.map((order) => (
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
                <div className={styles.productStack}>
                  {order.products.slice(0, 2).map((p) => (
                    <div key={p.id} className={styles.productThumb}>
                      <img src={p.image} alt={p.name} />
                    </div>
                  ))}
                  {order.products.length > 2 && (
                    <div className={`${styles.productThumb} ${styles.productOverflow}`}>
                      +{order.products.length - 2}
                    </div>
                  )}
                </div>
              </td>
              <td className={styles.cell}>
                <p className={styles.amount}>₹{(order.totalAmount || order.amount || 0).toLocaleString('en-IN')}</p>
              </td>
              <td className={styles.cell}>
                <span
                  className={`${styles.paymentBadge} ${styles[PAYMENT_CLASS[order.paymentStatus]]}`}
                >
                  {order.paymentStatus}
                </span>
              </td>
              <td className={styles.cell}>
                <span
                  className={`${styles.statusBadge} ${styles[STATUS_CLASS[order.status]]}`}
                >
                  <span className={styles.statusDot} />
                  {order.status}
                </span>
              </td>
              <td className={`${styles.cell} ${styles.alignRight}`}>
                <div
                  className={styles.rowActions}
                  onClick={(e) => e.stopPropagation()}
                >
                  <button
                    className={styles.iconButton}
                    title="View"
                    onClick={() => dispatch(openDrawer(order.id))}
                  >
                    <MdVisibility />
                  </button>
                  <button className={styles.iconButton} title="Coming Soon">
                    <MdEdit />
                  </button>
                  <button className={styles.iconButton} title="Integration Required">
                    <MdDownload />
                  </button>
                </div>
              </td>
            </tr>
          ))}
          {filtered.length === 0 && (
            <tr>
              <td colSpan={7} className={styles.emptyCell}>
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