import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { MdSearch, MdFilterList, MdSort } from "react-icons/md";
import { setSearchQuery } from "../../../redux/slices/productsSlice";
import styles from "./ProductToolbar.module.css";

const ProductToolbar = () => {
  const dispatch = useDispatch();
  const searchQuery = useSelector((state) => state.products.searchQuery);

  return (
    <div className={styles.row}>
      <div className={styles.searchWrapper}>
        <MdSearch className={styles.searchIcon} />
        <input
          className={styles.searchInput}
          type="text"
          placeholder="Search by product name, SKU, or category..."
          value={searchQuery}
          onChange={(e) => dispatch(setSearchQuery(e.target.value))}
        />
      </div>
      <button className={styles.toolButton} title="Coming Soon">
        <MdFilterList />
        Advanced Filters
      </button>
      <button className={styles.toolButton} title="Coming Soon">
        <MdSort />
        Sort
      </button>
    </div>
  );
};

export default ProductToolbar;