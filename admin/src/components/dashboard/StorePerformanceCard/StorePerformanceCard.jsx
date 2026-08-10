import React from "react";
import { useSelector } from "react-redux";
import styles from "./StorePerformanceCard.module.css";

const StorePerformanceCard = () => {
  const { healthLabel, healthValue, metrics } = useSelector(
    (state) => state.dashboard.storePerformance
  );

  return (
    <div className={styles.card}>
      <div>
        <p className={styles.label}>{healthLabel}</p>
        <h3 className={styles.value}>{healthValue}</h3>
      </div>
      <div className={styles.metrics}>
        {metrics.map((metric) => (
          <div key={metric.id} className={styles.metricRow}>
            <div className={styles.metricLine}>
              <span className={styles.metricLabel}>{metric.label}</span>
              <span className={styles.metricValue}>{metric.value}</span>
            </div>
            <div className={styles.track}>
              <div
                className={styles.fill}
                style={{ width: `${metric.percent}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StorePerformanceCard;