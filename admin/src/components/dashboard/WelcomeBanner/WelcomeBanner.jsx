import React from "react";
import { Link } from "react-router-dom";
import { MdAddBox, MdListAlt } from "react-icons/md";
import styles from "./WelcomeBanner.module.css";

const WelcomeBanner = () => {
  return (
    <div className={styles.banner}>
      <h2 className={styles.heading}>Welcome Back, Admin</h2>
      <p className={styles.copy}>
        Urban Layers Co. is performing exceptionally today. Sales are up by
        12% compared to last Tuesday, with a peak in 'Midnight Satin'
        collection interest.
      </p>
      <div className={styles.actions}>
        <Link to="/products/new" className={styles.primaryButton}>
          <MdAddBox />
          New Product
        </Link>
        <Link to="/orders" className={styles.secondaryButton}>
          <MdListAlt />
          View Orders
        </Link>
      </div>
    </div>
  );
};

export default WelcomeBanner;