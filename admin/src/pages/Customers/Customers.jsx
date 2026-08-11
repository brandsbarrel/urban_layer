import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { MdPersonAdd } from "react-icons/md";
import CustomerStatsRow from "../../components/customers/CustomerStatsRow/CustomerStatsRow";
import CustomerToolbar from "../../components/customers/CustomerToolbar/CustomerToolbar";
import BulkCustomerActionsBar from "../../components/customers/BulkCustomerActionsBar/BulkCustomerActionsBar";
import CustomersTable from "../../components/customers/CustomersTable/CustomersTable";
import CustomerDrawer from "../../components/customers/CustomerDrawer/CustomerDrawer";
import { fetchCustomers } from "../../redux/slices/customersSlice";
import styles from "./Customers.module.css";

const Customers = () => {
  const dispatch = useDispatch();
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const [filteredIds, setFilteredIds] = useState([]);

  React.useEffect(() => {
    if (isAuthenticated) {
      dispatch(fetchCustomers());
    }
  }, [dispatch, isAuthenticated]);

  return (
    <div className={styles.page}>
      <div className={styles.pageHeader}>
        <div>
          <h2 className={styles.title}>Customers</h2>
          <p className={styles.subtitle}>
            Manage customer accounts, orders, rewards, addresses, and
            activity within the global Urban Layers ecosystem.
          </p>
        </div>
        <button className={styles.addButton} title="Coming Soon">
          <MdPersonAdd /> Add Customer
        </button>
      </div>

      <CustomerStatsRow />

      <div className={styles.tableCard}>
        <CustomerToolbar />
        <BulkCustomerActionsBar allIds={filteredIds} />
        <CustomersTable onFilteredIdsChange={setFilteredIds} />
      </div>

      <CustomerDrawer />
    </div>
  );
};

export default Customers;
