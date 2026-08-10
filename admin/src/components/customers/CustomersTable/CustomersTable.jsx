import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { MdStars } from "react-icons/md";
import {
  toggleSelect,
  openDrawer,
} from "../../../redux/slices/customersSlice";
import styles from "./CustomersTable.module.css";

const STATUS_CLASS = {
  "VIP Elite": "statusVip",
  Active: "statusActive",
  Verified: "statusVerified",
  Deactivated: "statusDeactivated",
};

const CustomersTable = ({ onFilteredIdsChange }) => {
  const dispatch = useDispatch();
  const { items, selectedIds, searchQuery, vipFilter } = useSelector(
    (state) => state.customers
  );

  const query = searchQuery.trim().toLowerCase();
  const filtered = items.filter((c) => {
    const matchesQuery =
      !query ||
      c.name.toLowerCase().includes(query) ||
      c.email.toLowerCase().includes(query) ||
      c.id.toLowerCase().includes(query);
    const matchesVip = vipFilter === "All" || c.status === vipFilter;
    return matchesQuery && matchesVip;
  });

  React.useEffect(() => {
    onFilteredIdsChange(filtered.map((c) => c.id));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchQuery, vipFilter, items.length]);

  return (
    <div className={styles.tableWrapper}>
      <table className={styles.table}>
        <thead>
          <tr className={styles.headRow}>
            <th className={styles.checkboxCell}></th>
            <th className={styles.headCell}>Customer</th>
            <th className={styles.headCell}>Email</th>
            <th className={`${styles.headCell} ${styles.alignCenter}`}>
              Orders
            </th>
            <th className={styles.headCell}>Lifetime Spend</th>
            <th className={styles.headCell}>Reward Points</th>
            <th className={styles.headCell}>Status</th>
            <th className={styles.headCell}>Last Login</th>
          </tr>
        </thead>
        <tbody>
          {filtered.map((customer) => (
            <tr
              key={customer.id}
              className={styles.row}
              onClick={() => dispatch(openDrawer(customer.id))}
            >
              <td
                className={styles.checkboxCell}
                onClick={(e) => e.stopPropagation()}
              >
                <input
                  type="checkbox"
                  checked={selectedIds.includes(customer.id)}
                  onChange={() => dispatch(toggleSelect(customer.id))}
                />
              </td>
              <td className={styles.cell}>
                <div className={styles.customerCol}>
                  <img
                    src={customer.avatar}
                    alt={customer.name}
                    className={styles.avatar}
                  />
                  <div>
                    <p className={styles.customerName}>{customer.name}</p>
                    <p className={styles.customerId}>#{customer.id}</p>
                  </div>
                </div>
              </td>
              <td className={`${styles.cell} ${styles.email}`}>
                {customer.email}
              </td>
              <td className={`${styles.cell} ${styles.alignCenter}`}>
                {customer.totalOrders}
              </td>
              <td className={`${styles.cell} ${styles.spend}`}>
                ${customer.lifetimeSpend.toLocaleString(undefined, { minimumFractionDigits: 2 })}
              </td>
              <td className={styles.cell}>
                <span className={styles.points}>
                  <MdStars /> {customer.rewardPoints.toLocaleString()}
                </span>
              </td>
              <td className={styles.cell}>
                <span
                  className={`${styles.statusBadge} ${styles[STATUS_CLASS[customer.status] || "statusActive"]}`}
                >
                  {customer.status.toUpperCase()}
                </span>
              </td>
              <td className={`${styles.cell} ${styles.lastLogin}`}>
                {customer.lastLogin}
              </td>
            </tr>
          ))}
          {filtered.length === 0 && (
            <tr>
              <td colSpan={8} className={styles.emptyCell}>
                No customers match your filters.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default CustomersTable;