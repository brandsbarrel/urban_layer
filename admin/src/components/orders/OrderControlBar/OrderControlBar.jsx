import React from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  MdFilterList,
  MdCalendarToday,
  MdIosShare,
  MdAdd,
} from "react-icons/md";
import {
  setStatusFilter,
  setPaymentFilter,
  setDateRange,
} from "../../../redux/slices/ordersSlice";
import styles from "./OrderControlBar.module.css";

const OrderControlBar = () => {
  const dispatch = useDispatch();
  const { statusFilter, paymentFilter, dateRange } = useSelector(
    (state) => state.orders
  );

  return (
    <div className={styles.bar}>
      <div className={styles.filterLabel}>
        <MdFilterList />
        <span>Filters</span>
      </div>
      <select
        className={styles.select}
        value={statusFilter}
        onChange={(e) => dispatch(setStatusFilter(e.target.value))}
      >
        <option value="All">Order Status</option>
        <option value="Pending">Pending</option>
        <option value="Confirmed">Confirmed</option>
        <option value="Packed">Packed</option>
        <option value="Shipped">Shipped</option>
        <option value="Out for Delivery">Out for Delivery</option>
        <option value="Delivered">Delivered</option>
        <option value="Cancelled">Cancelled</option>
      </select>
      <select
        className={styles.select}
        value={paymentFilter}
        onChange={(e) => dispatch(setPaymentFilter(e.target.value))}
      >
        <option value="All">Payment</option>
        <option value="Paid">Paid</option>
        <option value="Pending">Pending</option>
        <option value="Failed">Failed</option>
      </select>
      <div className={styles.dateWrapper}>
        <MdCalendarToday className={styles.dateIcon} />
        <input
          className={styles.dateInput}
          type="text"
          placeholder="Date Range"
          value={dateRange}
          onChange={(e) => dispatch(setDateRange(e.target.value))}
        />
      </div>
      <div className={styles.rightActions}>
        <button className={styles.exportButton} title="Integration Required">
          <MdIosShare /> Export
        </button>
        <button className={styles.createButton} title="Coming Soon">
          <MdAdd /> Create Order
        </button>
      </div>
    </div>
  );
};

export default OrderControlBar;