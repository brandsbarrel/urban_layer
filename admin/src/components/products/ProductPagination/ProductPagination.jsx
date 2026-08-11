import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { MdChevronLeft, MdChevronRight } from "react-icons/md";
import { setPage } from "../../../redux/slices/productsSlice";
import styles from "./ProductPagination.module.css";

const ProductPagination = () => {
  const dispatch = useDispatch();
  const { page, perPage, totalItems } = useSelector(
    (state) => state.products.pagination
  );

  const start = (page - 1) * perPage + 1;
  const end = Math.min(page * perPage, totalItems);
  const totalPages = Math.ceil(totalItems / perPage);

  return (
    <div className={styles.footer}>
      <div className={styles.left}>
        <p className={styles.summary}>
          Showing <span className={styles.bold}>{start}-{end}</span> of{" "}
          <span className={styles.bold}>{totalItems.toLocaleString()}</span>
        </p>
        <select className={styles.perPageSelect} defaultValue={perPage}>
          <option value={10}>10 per page</option>
          <option value={25}>25 per page</option>
          <option value={50}>50 per page</option>
        </select>
      </div>
      <div className={styles.pages}>
        <button
          className={styles.navButton}
          disabled={page === 1}
          onClick={() => dispatch(setPage(page - 1))}
        >
          <MdChevronLeft /> Previous
        </button>
        {[1, 2, 3].map((p) => (
          <button
            key={p}
            className={p === page ? styles.pageActive : styles.pageButton}
            onClick={() => dispatch(setPage(p))}
          >
            {p}
          </button>
        ))}
        <span className={styles.ellipsis}>...</span>
        <button
          className={styles.pageButton}
          onClick={() => dispatch(setPage(totalPages))}
        >
          {totalPages}
        </button>
        <button
          className={styles.navButton}
          onClick={() => dispatch(setPage(page + 1))}
        >
          Next <MdChevronRight />
        </button>
      </div>
    </div>
  );
};

export default ProductPagination;