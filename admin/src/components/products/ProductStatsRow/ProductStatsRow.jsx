import React from "react";
import { useSelector } from "react-redux";
import {
  MdInventory2,
  MdCheckCircle,
  MdWarning,
  MdError,
} from "react-icons/md";
import styles from "./ProductStatsRow.module.css";

const ICON_MAP = {
  inventory_2: MdInventory2,
  check_circle: MdCheckCircle,
  warning: MdWarning,
  error: MdError,
};

const ProductStatsRow = () => {
  const stats = useSelector((state) => state.products.stats);

  return (
    <div className={styles.grid}>
      {stats.map((stat) => {
        const Icon = ICON_MAP[stat.icon];
        return (
          <div key={stat.id} className={styles.card}>
            <div className={styles.topRow}>
              <div className={`${styles.iconWrapper} ${styles[stat.tone]}`}>
                <Icon />
              </div>
              <svg
                className={`${styles.sparkline} ${styles[`stroke-${stat.tone}`]}`}
                viewBox="0 0 100 40"
              >
                <path d={stat.sparklinePath} />
              </svg>
            </div>
            <div>
              <p className={styles.label}>{stat.label}</p>
              <h4 className={styles.value}>{stat.value}</h4>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default ProductStatsRow;