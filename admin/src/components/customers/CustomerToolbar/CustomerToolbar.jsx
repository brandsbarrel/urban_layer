import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { MdFilterList, MdTune } from "react-icons/md";
import {
  setSearchQuery,
  setVipFilter,
  setRegionFilter,
} from "../../../redux/slices/customersSlice";
import styles from "./CustomerToolbar.module.css";

const CustomerToolbar = () => {
  const dispatch = useDispatch();
  const { searchQuery, vipFilter, regionFilter } = useSelector(
    (state) => state.customers
  );

  return (
    <div className={styles.row}>
      <div className={styles.searchWrapper}>
        <MdFilterList className={styles.searchIcon} />
        <input
          className={styles.searchInput}
          type="text"
          placeholder="Search by name, email, or ID..."
          value={searchQuery}
          onChange={(e) => dispatch(setSearchQuery(e.target.value))}
        />
      </div>
      <select
        className={styles.select}
        value={vipFilter}
        onChange={(e) => dispatch(setVipFilter(e.target.value))}
      >
        <option value="All">VIP Status: All</option>
        <option value="VIP Elite">Elite VIP</option>
        <option value="Active">Standard</option>
      </select>
      <select
        className={styles.select}
        value={regionFilter}
        onChange={(e) => dispatch(setRegionFilter(e.target.value))}
      >
        <option value="All">Region: All</option>
        <option value="North America">North America</option>
        <option value="Europe">Europe</option>
        <option value="Asia Pacific">Asia Pacific</option>
      </select>
      <button className={styles.moreButton} title="Coming Soon">
        <MdTune /> More Filters
      </button>
    </div>
  );
};

export default CustomerToolbar;