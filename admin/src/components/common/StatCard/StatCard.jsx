import React from "react";
import {
  MdPayments,
  MdLocalShipping,
  MdPersonAdd,
  MdTrendingUp,
  MdArrowUpward,
} from "react-icons/md";
import styles from "./StatCard.module.css";

const ICON_MAP = {
  payments: MdPayments,
  local_shipping: MdLocalShipping,
  person_add: MdPersonAdd,
  trending_up: MdTrendingUp,
};

const StatCard = ({ icon, label, value, change, trend, sparkline }) => {
  const Icon = ICON_MAP[icon] || MdTrendingUp;

  return (
    <div className={styles.card}>
      <div className={styles.topRow}>
        <span className={styles.iconWrapper}>
          <Icon />
        </span>
        <span
          className={
            trend === "up"
              ? `${styles.change} ${styles.changeUp}`
              : `${styles.change} ${styles.changeNeutral}`
          }
        >
          {trend === "up" && <MdArrowUpward className={styles.changeIcon} />}
          {change}
        </span>
      </div>
      <p className={styles.label}>{label}</p>
      <p className={styles.value}>{value}</p>
      <div className={styles.sparkline}>
        {sparkline.map((height, index) => (
          <div
            key={index}
            className={styles.sparkBar}
            style={{ height: `${height}%` }}
          />
        ))}
      </div>
    </div>
  );
};

export default StatCard;