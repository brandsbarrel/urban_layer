import React from "react";
import { useSelector } from "react-redux";
import {
  MdShoppingBag,
  MdPendingActions,
  MdLocalShipping,
  MdTaskAlt,
} from "react-icons/md";
import styles from "./OrderStatsRow.module.css";

const ICON_MAP = {
  shopping_bag: MdShoppingBag,
  pending_actions: MdPendingActions,
  local_shipping: MdLocalShipping,
  task_alt: MdTaskAlt,
};

const OrderStatsRow = () => {
  const stats = useSelector((state) => state.orders.stats);

  return (
    <section className={styles.grid}>
      {stats.map((stat) => {
        const Icon = ICON_MAP[stat.icon] || MdShoppingBag;
        return (
          <div
            key={stat.id}
            className={`${styles.card} ${styles[`accent-${stat.tone}`]}`}
          >
            <div className={styles.topRow}>
              <span className={`${styles.iconWrapper} ${styles[`icon-${stat.tone}`]}`}>
                <Icon />
              </span>
              {stat.change && (
                <span className={styles.changeBadge}>{stat.change}</span>
              )}
            </div>
            <h3 className={styles.label}>{stat.label}</h3>
            <p className={styles.value}>{stat.value.toLocaleString()}</p>
            {stat.note && <p className={styles.note}>{stat.note}</p>}
          </div>
        );
      })}
    </section>
  );
};

export default OrderStatsRow;