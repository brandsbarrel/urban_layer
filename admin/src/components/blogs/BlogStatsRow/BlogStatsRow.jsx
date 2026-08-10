import React from "react";
import { useSelector } from "react-redux";
import { MdArrowUpward, MdArrowDownward } from "react-icons/md";
import styles from "./BlogStatsRow.module.css";

const BlogStatsRow = () => {
  const stats = useSelector((state) => state.blogs.stats);

  return (
    <div className={styles.grid}>
      {stats.map((stat) => {
        const TrendIcon = stat.trend === "up" ? MdArrowUpward : MdArrowDownward;
        return (
          <div key={stat.id} className={styles.card}>
            <div className={styles.topRow}>
              <span className={styles.label}>{stat.label}</span>
              <span className={stat.trend === "up" ? styles.changeUp : styles.changeDown}>
                <TrendIcon /> {stat.change}
              </span>
            </div>
            <p className={styles.value}>
              {stat.value}
              {stat.suffix && <span className={styles.suffix}> {stat.suffix}</span>}
            </p>
          </div>
        );
      })}
    </div>
  );
};

export default BlogStatsRow;