import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { MdFilterList, MdDateRange } from "react-icons/md";
import {
  setPaymentFilter,
  setPaymentMethodFilter,
  setStartDate,
  setEndDate,
  setSortBy,
  setSortOrder
} from "../../../redux/slices/paymentsSlice";
import styles from "./PaymentsControlBar.module.css";

const PAYMENT_STATUS_OPTIONS = [
  "All", "Paid", "Pending", "Failed", "Refunded", "Partially Refunded", "Refund Processing"
];

const PAYMENT_METHOD_OPTIONS = [
  "All", "Online", "COD", "Razorpay"
];

const SORT_OPTIONS = [
  { value: "createdAt", label: "Date (Newest)" },
  { value: "createdAt", label: "Date (Oldest)", order: "asc" },
  { value: "amount", label: "Amount (High to Low)", order: "desc" },
  { value: "amount", label: "Amount (Low to High)", order: "asc" },
];

const PaymentsControlBar = () => {
  const dispatch = useDispatch();
  const { paymentFilter, paymentMethodFilter, startDate, endDate, sortBy, sortOrder } = useSelector((state) => state.payments);

  const handleSortChange = (e) => {
    const [value, order] = e.target.value.split("|");
    dispatch(setSortBy(value));
    if (order) dispatch(setSortOrder(order));
  };

  return (
    <div className={styles.controlBar}>
      <div className={styles.filtersRow}>
        <div className={styles.filterGroup}>
          <label className={styles.filterLabel} htmlFor="paymentStatus">Payment Status</label>
          <select
            id="paymentStatus"
            className={styles.filterSelect}
            value={paymentFilter}
            onChange={(e) => dispatch(setPaymentFilter(e.target.value))}
          >
            {PAYMENT_STATUS_OPTIONS.map((opt) => (
              <option key={opt} value={opt}>{opt}</option>
            ))}
          </select>
        </div>

        <div className={styles.filterGroup}>
          <label className={styles.filterLabel} htmlFor="paymentMethod">Payment Method</label>
          <select
            id="paymentMethod"
            className={styles.filterSelect}
            value={paymentMethodFilter}
            onChange={(e) => dispatch(setPaymentMethodFilter(e.target.value))}
          >
            {PAYMENT_METHOD_OPTIONS.map((opt) => (
              <option key={opt} value={opt}>{opt}</option>
            ))}
          </select>
        </div>

        <div className={styles.filterGroup}>
          <label className={styles.filterLabel} htmlFor="startDate">From</label>
          <input
            id="startDate"
            type="date"
            className={styles.filterInput}
            value={startDate}
            onChange={(e) => dispatch(setStartDate(e.target.value))}
          />
        </div>

        <div className={styles.filterGroup}>
          <label className={styles.filterLabel} htmlFor="endDate">To</label>
          <input
            id="endDate"
            type="date"
            className={styles.filterInput}
            value={endDate}
            onChange={(e) => dispatch(setEndDate(e.target.value))}
          />
        </div>

        <div className={styles.filterGroup}>
          <label className={styles.filterLabel} htmlFor="sortBy">Sort By</label>
          <select
            id="sortBy"
            className={styles.filterSelect}
            value={`${sortBy}|${sortOrder}`}
            onChange={handleSortChange}
          >
            {SORT_OPTIONS.map((opt) => (
              <option key={`${opt.value}|${opt.order || "desc"}`} value={`${opt.value}|${opt.order || "desc"}`}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
};

export default PaymentsControlBar;