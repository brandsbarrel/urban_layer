import React from "react";
import WelcomeBanner from "../../components/dashboard/WelcomeBanner/WelcomeBanner";
import StorePerformanceCard from "../../components/dashboard/StorePerformanceCard/StorePerformanceCard";
import KPIGrid from "../../components/dashboard/KPIGrid/KPIGrid";
import RevenueAnalytics from "../../components/dashboard/RevenueAnalytics/RevenueAnalytics";
import SalesAnalytics from "../../components/dashboard/SalesAnalytics/SalesAnalytics";
import OrdersOverview from "../../components/dashboard/OrdersOverview/OrdersOverview";
import InventoryStatus from "../../components/dashboard/InventoryStatus/InventoryStatus";
import BestSellingTable from "../../components/dashboard/BestSellingTable/BestSellingTable";
import RecentActivity from "../../components/dashboard/RecentActivity/RecentActivity";
import styles from "./Dashboard.module.css";

const Dashboard = () => {
  return (
    <div className={styles.page}>
      <section className={styles.bannerSection}>
        <div className={styles.bannerCol}>
          <WelcomeBanner />
        </div>
        <StorePerformanceCard />
      </section>

      <KPIGrid />

      <section className={styles.analyticsSection}>
        <RevenueAnalytics />
        <SalesAnalytics />
      </section>

      <section className={styles.midSection}>
        <div className={styles.ordersCol}>
          <OrdersOverview />
        </div>
        <InventoryStatus />
      </section>

      <section className={styles.bottomSection}>
        <div className={styles.tableCol}>
          <BestSellingTable />
        </div>
        <RecentActivity />
      </section>
    </div>
  );
};

export default Dashboard;