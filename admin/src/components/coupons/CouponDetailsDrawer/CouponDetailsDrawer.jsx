import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { MdClose, MdTrendingFlat } from "react-icons/md";
import {
  closeDetailsDrawer,
  openEditDrawer,
  setStatus,
} from "../../../redux/slices/couponsSlice";
import styles from "./CouponDetailsDrawer.module.css";

const CouponDetailsDrawer = () => {
  const dispatch = useDispatch();
  const detailsDrawerId = useSelector((state) => state.coupons.detailsDrawerId);
  const coupon = useSelector((state) => state.coupons.items.find((c) => c.id === detailsDrawerId));
  const isOpen = Boolean(coupon);

  return (
    <>
      <div className={`${styles.overlay} ${isOpen ? styles.overlayOpen : ""}`} onClick={() => dispatch(closeDetailsDrawer())} />
      <div className={`${styles.drawer} ${isOpen ? styles.drawerOpen : ""}`}>
        {coupon && (
          <div className={styles.content}>
            <div className={styles.header}>
              <div>
                <span className={styles.eyebrow}>CAMPAIGN OVERVIEW</span>
                <h2 className={styles.title}>{coupon.title}</h2>
                <p className={styles.subtitle}>{coupon.subtitle}</p>
              </div>
              <button className={styles.closeButton} onClick={() => dispatch(closeDetailsDrawer())}>
                <MdClose />
              </button>
            </div>

            <div className={styles.sections}>
              <section>
                <h3 className={styles.sectionLabel}>Configuration</h3>
                <div className={styles.configGrid}>
                  <div>
                    <p className={styles.fieldLabel}>Coupon Type</p>
                    <p className={styles.fieldValue}>{coupon.discountType}</p>
                  </div>
                  <div>
                    <p className={styles.fieldLabel}>Discount Value</p>
                    <p className={styles.fieldValuePrimary}>{coupon.discountValue}% Off</p>
                  </div>
                  <div>
                    <p className={styles.fieldLabel}>Min. Order Value</p>
                    <p className={styles.fieldValue}>${coupon.minOrderValue}</p>
                  </div>
                  <div>
                    <p className={styles.fieldLabel}>Max. Redemption</p>
                    <p className={styles.fieldValue}>{coupon.maxRedemption}</p>
                  </div>
                </div>
              </section>

              <section className={styles.dateBox}>
                <div>
                  <p className={styles.fieldLabel}>Start Date</p>
                  <p className={styles.fieldValue}>{coupon.startDate}</p>
                </div>
                <MdTrendingFlat className={styles.arrowIcon} />
                <div className={styles.dateRight}>
                  <p className={styles.fieldLabel}>End Date</p>
                  <p className={styles.fieldValue}>{coupon.endDate}</p>
                </div>
              </section>

              <section>
                <h3 className={styles.sectionLabel}>Live Performance (read-only)</h3>
                <div className={styles.perfBlock}>
                  <div className={styles.perfHeader}>
                    <p className={styles.perfLabel}>Usage Frequency</p>
                  </div>
                  <div className={styles.usageChart}>
                    {coupon.usageTrend.map((v, i) => (
                      <div key={i} className={styles.usageBar} style={{ height: `${v}%` }} />
                    ))}
                  </div>
                </div>
                <div className={styles.perfBlock}>
                  <div className={styles.perfHeader}>
                    <p className={styles.perfLabel}>Revenue Accumulation</p>
                    <span className={styles.revenueValue}>${coupon.revenue.toLocaleString()}</span>
                  </div>
                </div>
              </section>

              <section>
                <h3 className={styles.sectionLabel}>Status</h3>
                <div className={styles.statusRow}>
                  <span className={styles.currentStatus}>{coupon.status}</span>
                  <div className={styles.statusButtons}>
                    {coupon.status !== "Active" && (
                      <button onClick={() => dispatch(setStatus({ id: coupon.id, status: "Active" }))}>
                        Activate
                      </button>
                    )}
                    {coupon.status === "Active" && (
                      <button onClick={() => dispatch(setStatus({ id: coupon.id, status: "Scheduled" }))}>
                        Pause
                      </button>
                    )}
                    {coupon.status !== "Expired" && (
                      <button
                        className={styles.archiveButton}
                        onClick={() => dispatch(setStatus({ id: coupon.id, status: "Expired" }))}
                      >
                        Archive
                      </button>
                    )}
                  </div>
                </div>
              </section>
            </div>

            <div className={styles.footer}>
              <button className={styles.reportButton} title="Integration Required">
                Download Report
              </button>
              <button className={styles.editButton} onClick={() => dispatch(openEditDrawer(coupon.id))}>
                Edit Campaign
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default CouponDetailsDrawer;