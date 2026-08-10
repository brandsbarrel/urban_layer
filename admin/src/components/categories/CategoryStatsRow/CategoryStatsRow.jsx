import React from "react";
import { useSelector } from "react-redux";
import { MdTrendingUp } from "react-icons/md";
import styles from "./CategoryStatsRow.module.css";

const CategoryStatsRow = () => {
  const stats = useSelector((state) => state.categories.stats);

  return (
    <div className={styles.grid}>
      {stats.map((stat) => (
        <div key={stat.id} className={styles.card}>
          <p className={styles.label}>{stat.label}</p>
          <div className={styles.valueRow}>
            <span className={styles.value}>{stat.value}</span>
            {stat.noteTone === "primary" && (
              <span className={styles.notePrimary}>{stat.note}</span>
            )}
            {stat.noteTone === "badge" && (
              <span className={styles.noteBadge}>{stat.note}</span>
            )}
            {stat.noteTone === "icon" && (
              <MdTrendingUp className={styles.noteIcon} />
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default CategoryStatsRow;