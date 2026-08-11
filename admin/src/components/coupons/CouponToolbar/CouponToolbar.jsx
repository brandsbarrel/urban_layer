import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { MdSearch, MdCalendarToday } from "react-icons/md";
import { setSearchQuery, setStatusFilter, setTypeFilter } from "../../../redux/slices/couponsSlice";
import styles from "./CouponToolbar.module.css";

const CouponToolbar = () => {
  const dispatch = useDispatch();
  const { searchQuery, statusFilter, typeFilter } = useSelector((state) => state.coupons);

  return (
    <div className={styles.bar}>
      <div className={styles.searchWrapper}>
        <MdSearch className={styles.searchIcon} />
        <input
          className={styles.searchInput}
          type="text"
          placeholder="Search by campaign name or code..."
          value={searchQuery}
          onChange={(e) => dispatch(setSearchQuery(e.target.value))}
        />
      </div>
      <div className={styles.filters}>
        <select className={styles.select} value={statusFilter} onChange={(e) => dispatch(setStatusFilter(e.target.value))}>
          <option value="All">Status: All</option>
          <option value="Active">Active</option>
          <option value="Scheduled">Scheduled</option>
          <option value="Expired">Expired</option>
        </select>
        <select className={styles.select} value={typeFilter} onChange={(e) => dispatch(setTypeFilter(e.target.value))}>
          <option value="All">Type: All</option>
          <option value="Flash Sale">Flash Sale</option>
          <option value="Direct Discount">Direct Discount</option>
          <option value="Buy X Get Y">Buy X Get Y</option>
        </select>
        <button className={styles.iconButton} title="Coming Soon">
          <MdCalendarToday />
        </button>
      </div>
    </div>
  );
};

export default CouponToolbar;