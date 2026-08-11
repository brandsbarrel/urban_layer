import React from "react";
import { Link } from "react-router-dom";
import styles from "./Footer.module.css";

const Footer = () => {
  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>
        <p className={styles.copy}>
          © 2026 Urban Layers Co. All Rights Reserved. Confidential
          Enterprise Material.
        </p>
        <div className={styles.linkGroup}>
          <Link to="/activity" className={styles.link}>
            System Health
          </Link>
          <Link to="/settings" className={styles.link}>
            Privacy Policy
          </Link>
          <Link to="/settings" className={styles.link}>
            API Docs
          </Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;