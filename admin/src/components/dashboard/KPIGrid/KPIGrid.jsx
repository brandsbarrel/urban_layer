import React from "react";
import { useSelector } from "react-redux";
import StatCard from "../../common/StatCard/StatCard";
import styles from "./KPIGrid.module.css";

const KPIGrid = () => {
  const kpis = useSelector((state) => state.dashboard.kpis);

  return (
    <section className={styles.grid}>
      {kpis.map((kpi) => (
        <StatCard key={kpi.id} {...kpi} />
      ))}
    </section>
  );
};

export default KPIGrid;