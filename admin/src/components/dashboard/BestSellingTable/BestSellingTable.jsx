import React from "react";
import { useSelector } from "react-redux";
import { MdFilterList } from "react-icons/md";
import styles from "./BestSellingTable.module.css";

const BestSellingTable = () => {
  const products = useSelector((state) => state.dashboard.bestSellingProducts);

  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <h3 className={styles.title}>Best Selling Products</h3>
        <button
          type="button"
          className={styles.filterButton}
          title="Coming Soon"
        >
          <MdFilterList />
          Filter
        </button>
      </div>
      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <thead>
            <tr className={styles.headRow}>
              <th className={styles.headCell}>Product</th>
              <th className={styles.headCell}>Price</th>
              <th className={styles.headCell}>Units Sold</th>
              <th className={`${styles.headCell} ${styles.alignRight}`}>
                Revenue
              </th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product.id} className={styles.row}>
                <td className={styles.productCell}>
                  <div className={styles.thumb}>
                    <img src={product.image} alt={product.name} />
                  </div>
                  <div>
                    <p className={styles.productName}>{product.name}</p>
                    <p className={styles.productCategory}>
                      {product.category}
                    </p>
                  </div>
                </td>
                <td className={styles.cell}>{product.price}</td>
                <td className={styles.cell}>{product.unitsSold}</td>
                <td className={`${styles.cell} ${styles.alignRight} ${styles.bold}`}>
                  {product.revenue}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default BestSellingTable;