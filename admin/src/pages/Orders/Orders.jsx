import React from "react";
import { useDispatch } from "react-redux";
import { setSearchQuery } from "../../redux/slices/ordersSlice";
import OrderStatsRow from "../../components/orders/OrderStatsRow/OrderStatsRow";
import OrderControlBar from "../../components/orders/OrderControlBar/OrderControlBar";
import OrdersTable from "../../components/orders/OrdersTable/OrdersTable";
import OrderDrawer from "../../components/orders/OrderDrawer/OrderDrawer";
import styles from "./Orders.module.css";

const Orders = () => {
  const dispatch = useDispatch();

  return (
    <div className={styles.page}>
      <OrderStatsRow />
      <OrderControlBar />

      <div className={styles.searchRow}>
        <input
          className={styles.searchInput}
          type="text"
          placeholder="Search Order IDs, customers, or SKUs..."
          onChange={(e) => dispatch(setSearchQuery(e.target.value))}
        />
      </div>

      <div className={styles.tableCard}>
        <OrdersTable />
        <div className={styles.paginationFooter}>
          <p className={styles.paginationText}>Showing 1 to 3 of 2,842 results</p>
        </div>
      </div>

      <OrderDrawer />
    </div>
  );
};

export default Orders;