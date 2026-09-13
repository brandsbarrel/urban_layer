import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { MdSearch, MdFilterList, MdSort, MdStar } from "react-icons/md";
import { setSearchQuery, setBestSellerFilter } from "../../../redux/slices/productsSlice";
import styles from "./ProductToolbar.module.css";

const ProductToolbar = () => {
  const dispatch = useDispatch();
  const searchQuery = useSelector((state) => state.products.searchQuery);
  const bestSellerOnly = useSelector((state) => state.products.bestSellerOnly);

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
      <button
        className={`${styles.toolButton} ${bestSellerOnly ? styles.toolButtonActive : ""}`}
        type="button"
        onClick={() => dispatch(setBestSellerFilter(!bestSellerOnly))}
      >
        <MdStar style={{ color: bestSellerOnly ? "#ca8a04" : "#999", fontSize: "16px" }} />
        {bestSellerOnly ? "Best Sellers (Filtered)" : "Best Sellers Only"}
      </button>
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