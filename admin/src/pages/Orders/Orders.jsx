import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchOrders, setSearchQuery, setPage } from "../../redux/slices/ordersSlice";
import OrderStatsRow from "../../components/orders/OrderStatsRow/OrderStatsRow";
import OrderControlBar from "../../components/orders/OrderControlBar/OrderControlBar";
import OrdersTable from "../../components/orders/OrdersTable/OrdersTable";
import OrderDrawer from "../../components/orders/OrderDrawer/OrderDrawer";
import styles from "./Orders.module.css";

const Orders = () => {
  const dispatch = useDispatch();
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const { searchQuery, statusFilter, paymentFilter, page, perPage, meta } = useSelector(
    (state) => state.orders
  );

  React.useEffect(() => {
    if (isAuthenticated) {
      dispatch(fetchOrders());
    }
  }, [dispatch, isAuthenticated, searchQuery, statusFilter, paymentFilter, page]);

  const totalItems = meta?.totalItems || 0;
  const startItem = totalItems > 0 ? (page - 1) * perPage + 1 : 0;
  const endItem = Math.min(page * perPage, totalItems);
  const totalPages = meta?.totalPages || Math.ceil(totalItems / perPage) || 1;

  return (
    <div className={styles.page}>
      <OrderStatsRow />
      <OrderControlBar />

      <div className={styles.searchRow}>
        <input
          className={styles.searchInput}
          type="text"
          value={searchQuery}
          placeholder="Search Order IDs, customers, or SKUs..."
          onChange={(e) => dispatch(setSearchQuery(e.target.value))}
        />
      </div>

      <div className={styles.tableCard}>
        <OrdersTable />
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

      <OrderDrawer />
    </div>
  );
};

export default Orders;
