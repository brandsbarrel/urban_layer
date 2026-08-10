import React from "react";
import { useSelector } from "react-redux";
import { MdGroup, MdDiamond, MdStars, MdRefresh, MdTrendingUp, MdTrendingDown } from "react-icons/md";
import styles from "./CustomerStatsRow.module.css";

const ICON_MAP = { group: MdGroup, diamond: MdDiamond, stars: MdStars, refresh: MdRefresh };

const CustomerStatsRow = () => {
  const stats = useSelector((state) => state.customers.stats);

  return (
    <div className={styles.grid}>
      {stats.map((stat) => {
        const Icon = ICON_MAP[stat.icon];
        const TrendIcon = stat.trend === "up" ? MdTrendingUp : MdTrendingDown;
        return (
          <div key={stat.id} className={styles.card}>
            <div className={styles.topRow}>
              <div>
                <p className={styles.label}>{stat.label}</p>
                <h3 className={styles.value}>{stat.value}</h3>
              </div>
              <div className={`${styles.iconWrapper} ${styles[`tone-${stat.tone}`]}`}>
                <Icon />
              </div>
            </div>
            <div className={styles.bottomRow}>
              <div className={`${styles.change} ${styles[`change-${stat.trend}`]}`}>
                <TrendIcon />
                {stat.change}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default CustomerStatsRow;