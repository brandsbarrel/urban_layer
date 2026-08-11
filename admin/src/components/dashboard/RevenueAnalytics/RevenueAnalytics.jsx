import React from "react";
import { useSelector, useDispatch } from "react-redux";
import PeriodToggle from "../../common/PeriodToggle/PeriodToggle";
import { setRevenueChartPeriod } from "../../../redux/slices/dashboardSlice";
import styles from "./RevenueAnalytics.module.css";

const RevenueAnalytics = () => {
  const dispatch = useDispatch();
  const period = useSelector((state) => state.dashboard.revenueChartPeriod);
  const series = useSelector(
    (state) => state.dashboard.revenueSeriesByPeriod[period]
  );

  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <h3 className={styles.title}>Revenue Analytics</h3>
        <PeriodToggle
          value={period}
          onChange={(value) => dispatch(setRevenueChartPeriod(value))}
        />
      </div>
      <div className={styles.chartArea}>
        <svg
          className={styles.svg}
          preserveAspectRatio="none"
          viewBox="0 0 100 100"
        >
          <path d={series.areaPath} fill="rgba(212, 175, 55, 0.1)" />
          <path
            d={series.linePath}
            fill="none"
            stroke="#d4af37"
            strokeWidth="2"
          />
        </svg>
        <div className={styles.axisLabels}>
          <span>$100k</span>
          <span>$75k</span>
          <span>$50k</span>
          <span>$25k</span>
          <span>0</span>
        </div>
      </div>
      <div className={styles.xAxis}>
        {series.labels.map((label) => (
          <span key={label}>{label}</span>
        ))}
      </div>
    </div>
  );
};

export default RevenueAnalytics;