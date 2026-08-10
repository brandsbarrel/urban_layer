import React from "react";
import { Link } from "react-router-dom";
import { MdRefresh, MdFileUpload, MdAdd } from "react-icons/md";
import ProductStatsRow from "../../components/products/ProductStatsRow/ProductStatsRow";
import ProductToolbar from "../../components/products/ProductToolbar/ProductToolbar";
import BulkActionsBar from "../../components/products/BulkActionsBar/BulkActionsBar";
import ProductsTable from "../../components/products/ProductsTable/ProductsTable";
import ProductPagination from "../../components/products/ProductPagination/ProductPagination";
import ProductDrawer from "../../components/products/ProductDrawer/ProductDrawer";
import styles from "./Products.module.css";

const Products = () => {
  return (
    <div className={styles.page}>
      <div className={styles.pageHeader}>
        <div>
          <h2 className={styles.title}>All Products</h2>
          <p className={styles.subtitle}>
            Manage, organize, and monitor your product catalog with high
            precision.
          </p>
        </div>
        <div className={styles.headerActions}>
          <button className={styles.secondaryButton} title="Integration Required">
            <MdRefresh /> Refresh
          </button>
          <button className={styles.secondaryButton} title="Integration Required">
            <MdFileUpload /> Export
          </button>
          <Link to="/products/new" className={styles.primaryButton}>
            <MdAdd /> Add Product
          </Link>
        </div>
      </div>

      <ProductStatsRow />

      <div className={styles.toolbarSection}>
        <ProductToolbar />
        <BulkActionsBar />
      </div>

      <div className={styles.tableCard}>
        <ProductsTable />
        <ProductPagination />
      </div>

      <ProductDrawer />
    </div>
  );
};

export default Products;