import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { MdFilterList, MdTune } from "react-icons/md";
import {
  setSearchQuery,
  setStatusFilter,
  setParentFilter,
} from "../../../redux/slices/categoriesSlice";
import styles from "./CategoryToolbar.module.css";

const CategoryToolbar = () => {
  const dispatch = useDispatch();
  const { searchQuery, statusFilter, parentFilter } = useSelector(
    (state) => state.categories
  );

  return (
    <div className={styles.row}>
      <div className={styles.searchWrapper}>
        <MdFilterList className={styles.searchIcon} />
        <input
          className={styles.searchInput}
          type="text"
          placeholder="Filter by name, slug, or ID..."
          value={searchQuery}
          onChange={(e) => dispatch(setSearchQuery(e.target.value))}
        />
      </div>
      <select
        className={styles.select}
        value={statusFilter}
        onChange={(e) => dispatch(setStatusFilter(e.target.value))}
      >
        <option>All</option>
        <option>Active</option>
        <option>Hidden</option>
      </select>
      <select
        className={styles.select}
        value={parentFilter}
        onChange={(e) => dispatch(setParentFilter(e.target.value))}
      >
        <option>None</option>
        <option>Accessories</option>
        <option>Apparel</option>
      </select>
      <button className={styles.advancedButton} title="Coming Soon">
        <MdTune /> Advanced
      </button>
    </div>
  );
};

export default CategoryToolbar;