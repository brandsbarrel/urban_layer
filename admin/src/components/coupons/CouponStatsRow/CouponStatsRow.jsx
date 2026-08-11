import React from "react";
import { useSelector } from "react-redux";
import { MdCampaign, MdConfirmationNumber, MdPayments, MdPercent, MdTrendingUp } from "react-icons/md";
import styles from "./CouponStatsRow.module.css";

const ICON_MAP = { campaign: MdCampaign, confirmation_number: MdConfirmationNumber, payments: MdPayments, percent: MdPercent };

const CouponStatsRow = () => {
  const stats = useSelector((state) => state.coupons.stats);

  return (
    <div className={styles.grid}>
      {stats.map((stat) => {
        const Icon = ICON_MAP[stat.icon];
        return (
          <div key={stat.id} className={styles.card}>
            <div className={styles.topRow}>
              <span className={styles.label}>{stat.label}</span>
              <Icon className={styles.icon} />
            </div>
            <div className={styles.valueRow}>
              <span className={styles.value}>{stat.value}</span>
            </div>
            <p className={stat.tone === "up" ? styles.noteUp : styles.noteNeutral}>
              {stat.tone === "up" && <MdTrendingUp />} {stat.note}
            </p>
          </div>
        );
      })}
    </div>
  );
};

export default CouponStatsRow;