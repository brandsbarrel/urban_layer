import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchPayments, setSearchQuery, setPage, openDrawer } from "../../redux/slices/paymentsSlice";
import PaymentsTable from "../../components/payments/PaymentsTable/PaymentsTable";
import PaymentDrawer from "../../components/payments/PaymentDrawer/PaymentDrawer";
import PaymentsControlBar from "../../components/payments/PaymentsControlBar/PaymentsControlBar";
import styles from "./Payments.module.css";

const Payments = () => {
  const dispatch = useDispatch();
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const {
    searchQuery, paymentFilter, paymentMethodFilter,
    startDate, endDate, sortBy, sortOrder,
    page, perPage, meta, loading
  } = useSelector((state) => state.payments);

  React.useEffect(() => {
    if (isAuthenticated) {
      dispatch(fetchPayments());
    }
  }, [
    dispatch, isAuthenticated, searchQuery, paymentFilter, paymentMethodFilter,
    startDate, endDate, sortBy, sortOrder, page
  ]);

  // Listen for open drawer events from table rows
  React.useEffect(() => {
    const handler = (e) => {
      dispatch(openDrawer(e.detail));
    };
    window.addEventListener("openPaymentDrawer", handler);
    return () => window.removeEventListener("openPaymentDrawer", handler);
  }, [dispatch]);

  const totalItems = meta?.totalItems || 0;
  const startItem = totalItems > 0 ? (page - 1) * perPage + 1 : 0;
  const endItem = Math.min(page * perPage, totalItems);
  const totalPages = meta?.totalPages || Math.ceil(totalItems / perPage) || 1;

  return (
    <div className={styles.page}>
      <PaymentsControlBar />

      <div className={styles.searchRow}>
        <input
          className={styles.searchInput}
          type="text"
          value={searchQuery}
          placeholder="Search payments, orders, customers..."
          onChange={(e) => dispatch(setSearchQuery(e.target.value))}
        />
        {loading && <span className={styles.loadingDot}>Loading...</span>}
      </div>

      <div className={styles.tableCard}>
        <PaymentsTable />
        <div className={styles.paginationFooter}>
          <p className={styles.paginationText}>
            Showing {startItem} to {endItem} of {totalItems} results
          </p>
          <div className={styles.pageControls}>
            <button
              className={styles.pageButton}
              disabled={page <= 1}
              onClick={() => dispatch(setPage(page - 1))}
            >
              Previous
            </button>
            <span className={styles.paginationText}>
              Page {page} of {totalPages}
            </span>
            <button
              className={styles.pageButton}
              disabled={page >= totalPages}
              onClick={() => dispatch(setPage(page + 1))}
            >
              Next
            </button>
          </div>
        </div>
      </div>

      <PaymentDrawer />
    </div>
  );
};

export default Payments;