import React from "react";
import { useSelector, useDispatch } from "react-redux";
import PeriodToggle from "../../common/PeriodToggle/PeriodToggle";
import { setSalesChartPeriod } from "../../../redux/slices/dashboardSlice";
import styles from "./SalesAnalytics.module.css";

const SalesAnalytics = () => {
  const dispatch = useDispatch();
  const period = useSelector((state) => state.dashboard.salesChartPeriod);
  const series = useSelector(
    (state) => state.dashboard.salesBarsByPeriod[period]
  );

  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <h3 className={styles.title}>Sales Analytics</h3>
        <PeriodToggle
          value={period}
          onChange={(value) => dispatch(setSalesChartPeriod(value))}
        />
      </div>
      <div className={styles.chartArea}>
        {series.values.map((value, index) => (
          <div key={index} className={styles.bar} style={{ height: `${value}%` }} />
        ))}
      </div>
      <div className={styles.xAxis}>
        {series.labels.map((label) => (
          <span key={label}>{label}</span>
        ))}
      </div>
    </div>
  );
};

export default SalesAnalytics;