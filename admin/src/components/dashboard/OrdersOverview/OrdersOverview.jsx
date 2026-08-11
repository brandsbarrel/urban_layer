import React from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import styles from "./OrdersOverview.module.css";

const ACCENT_CLASS = {
  warning: "accentWarning",
  info: "accentInfo",
  primary: "accentPrimary",
  success: "accentSuccess",
};

const OrdersOverview = () => {
  const overview = useSelector((state) => state.dashboard.ordersOverview);
  const avatars = useSelector((state) => state.dashboard.ordersAvatars);
  const overflowCount = useSelector(
    (state) => state.dashboard.ordersAvatarOverflowCount
  );

  return (
    <div className={styles.card}>
      <h3 className={styles.title}>Orders Overview</h3>
      <div className={styles.statGrid}>
        {overview.map((item) => (
          <div key={item.id} className={styles.statCell}>
            <span className={styles.statLabel}>{item.label}</span>
            <span className={styles.statCount}>{item.count}</span>
            <div
              className={`${styles.statBar} ${styles[ACCENT_CLASS[item.accent]]}`}
            />
          </div>
        ))}
      </div>
      <div className={styles.footerRow}>
        <div className={styles.avatarStack}>
          {avatars.map((avatar) => (
            <div key={avatar.id} className={styles.avatar}>
              <img src={avatar.src} alt={avatar.alt} />
            </div>
          ))}
          <div className={`${styles.avatar} ${styles.avatarOverflow}`}>
            +{overflowCount}
          </div>
        </div>
        <Link to="/orders" className={styles.manageLink}>
          Manage all orders
        </Link>
      </div>
    </div>
  );
};

export default OrdersOverview;