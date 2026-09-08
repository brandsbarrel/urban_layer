import React from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  MdFilterList,
  MdIosShare,
  MdSort,
} from "react-icons/md";
import {
  setStatusFilter,
  setPaymentFilter,
  setPaymentMethodFilter,
  setShippingStatusFilter,
  setStartDate,
  setEndDate,
  setSortBy,
  setSortOrder,
} from "../../../redux/slices/ordersSlice";
import styles from "./OrderControlBar.module.css";

const OrderControlBar = () => {
  const dispatch = useDispatch();
  const {
    statusFilter, paymentFilter, paymentMethodFilter,
    shippingStatusFilter, startDate, endDate, sortBy, sortOrder
  } = useSelector((state) => state.orders);

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
        <option value="Processing">Processing</option>
        <option value="Packed">Packed</option>
        <option value="Shipped">Shipped</option>
        <option value="Out for Delivery">Out for Delivery</option>
        <option value="Delivered">Delivered</option>
        <option value="Cancelled">Cancelled</option>
        <option value="Return Requested">Return Requested</option>
        <option value="Return Approved">Return Approved</option>
        <option value="Returned">Returned</option>
        <option value="Refunded">Refunded</option>
      </select>
      <select
        className={styles.select}
        value={paymentFilter}
        onChange={(e) => dispatch(setPaymentFilter(e.target.value))}
      >
        <option value="All">Payment Status</option>
        <option value="Paid">Paid</option>
        <option value="Pending">Pending</option>
        <option value="Failed">Failed</option>
        <option value="Refunded">Refunded</option>
        <option value="Partially Refunded">Partially Refunded</option>
      </select>
      <select
        className={styles.select}
        value={paymentMethodFilter}
        onChange={(e) => dispatch(setPaymentMethodFilter(e.target.value))}
      >
        <option value="All">Payment Method</option>
        <option value="Online">Online / Prepaid</option>
        <option value="COD">COD</option>
      </select>
      <select
        className={styles.select}
        value={shippingStatusFilter}
        onChange={(e) => dispatch(setShippingStatusFilter(e.target.value))}
      >
        <option value="All">Shipping Status</option>
        <option value="Label Created">Label Created</option>
        <option value="Pickup Scheduled">Pickup Scheduled</option>
        <option value="Picked Up">Picked Up</option>
        <option value="In Transit">In Transit</option>
        <option value="Out for Delivery">Out for Delivery</option>
        <option value="Delivered">Delivered</option>
        <option value="RTO">RTO</option>
        <option value="Cancelled">Cancelled</option>
      </select>
      <div className={styles.dateGroup}>
        <input
          className={styles.dateInput}
          type="date"
          value={startDate}
          onChange={(e) => dispatch(setStartDate(e.target.value))}
          title="Start Date"
        />
        <span className={styles.dateSep}>to</span>
        <input
          className={styles.dateInput}
          type="date"
          value={endDate}
          onChange={(e) => dispatch(setEndDate(e.target.value))}
          title="End Date"
        />
      </div>
      <div className={styles.rightActions}>
        <div className={styles.sortGroup}>
          <MdSort />
          <select
            className={styles.sortSelect}
            value={sortBy}
            onChange={(e) => dispatch(setSortBy(e.target.value))}
          >
            <option value="createdAt">Date</option>
            <option value="totalAmount">Amount</option>
            <option value="orderNumber">Order #</option>
            <option value="status">Status</option>
          </select>
          <button
            className={styles.sortOrderBtn}
            onClick={() => dispatch(setSortOrder(sortOrder === "desc" ? "asc" : "desc"))}
            title={sortOrder === "desc" ? "Descending" : "Ascending"}
          >
            {sortOrder === "desc" ? "↓" : "↑"}
          </button>
        </div>
        <button className={styles.exportButton} title="Integration Required">
          <MdIosShare /> Export
        </button>
      </div>
    </div>
  );
};

export default OrderControlBar;