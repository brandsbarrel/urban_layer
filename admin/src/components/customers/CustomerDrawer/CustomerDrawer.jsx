import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { MdClose, MdDiamond, MdShoppingBag, MdLogin, MdSupportAgent, MdStar } from "react-icons/md";
import { closeDrawer, deactivateCustomer } from "../../../redux/slices/customersSlice";
import ConfirmModal from "../../common/ConfirmModal/ConfirmModal";
import styles from "./CustomerDrawer.module.css";

const ACTIVITY_ICON = {
  shopping_bag: MdShoppingBag,
  login: MdLogin,
  support_agent: MdSupportAgent,
  star: MdStar,
};

const CustomerDrawer = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const drawerCustomerId = useSelector((state) => state.customers.drawerCustomerId);
  const customer = useSelector((state) =>
    state.customers.items.find((c) => c.id === drawerCustomerId)
  );
  const isOpen = Boolean(customer);
  const [restrictConfirmOpen, setRestrictConfirmOpen] = useState(false);

  return (
    <>
      <div
        className={`${styles.backdrop} ${isOpen ? styles.backdropOpen : ""}`}
        onClick={() => dispatch(closeDrawer())}
      />
      <div className={`${styles.drawer} ${isOpen ? styles.drawerOpen : ""}`}>
        {customer && (
          <>
            <div className={styles.header}>
              <h3 className={styles.title}>Customer Overview</h3>
              <button
                className={styles.closeButton}
                onClick={() => dispatch(closeDrawer())}
              >
                <MdClose />
              </button>
            </div>

            <div className={styles.body}>
              <div className={styles.profileTop}>
                <div className={styles.avatarWrapper}>
                  <img src={customer.avatar} alt={customer.name} />
                  {customer.status === "VIP Elite" && (
                    <div className={styles.vipBadgeIcon}>
                      <MdDiamond />
                    </div>
                  )}
                </div>
                <h4 className={styles.name}>{customer.name}</h4>
                <p className={styles.email}>{customer.email}</p>
                <div className={styles.badgeRow}>
                  <span className={styles.statusPill}>
                    {customer.status.toUpperCase()}
                  </span>
                  <span className={styles.tierPill}>{customer.tier}</span>
                </div>
              </div>

              <div className={styles.actionGrid}>
                <button className={styles.actionButton} title="Coming Soon">
                  Edit Profile
                </button>
                <button
                  className={styles.actionButton}
                  onClick={() => navigate("/orders")}
                >
                  View All Orders
                </button>
                <button className={styles.actionButton} title="Integration Required">
                  Send Message
                </button>
                <button
                  className={`${styles.actionButton} ${styles.actionDanger}`}
                  disabled={customer.status === "Deactivated"}
                  onClick={() => setRestrictConfirmOpen(true)}
                >
                  {customer.status === "Deactivated"
                    ? "Restricted"
                    : "Restrict Account"}
                </button>
              </div>

              <div>
                <h5 className={styles.sectionLabel}>Recent Activity</h5>
                <div className={styles.timeline}>
                  {customer.activity.length === 0 && (
                    <p className={styles.noActivity}>No recent activity.</p>
                  )}
                  {customer.activity.map((entry) => {
                    const Icon = ACTIVITY_ICON[entry.icon];
                    return (
                      <div key={entry.id} className={styles.activityItem}>
                        <div className={styles.activityIcon}>
                          <Icon />
                        </div>
                        <div>
                          <p className={styles.activityTitle}>{entry.title}</p>
                          <p className={styles.activityMeta}>{entry.meta}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className={styles.detailsBox}>
                <div className={styles.detailRow}>
                  <span>Customer Since</span>
                  <span className={styles.detailValue}>
                    {customer.customerSince}
                  </span>
                </div>
                <div className={styles.detailRow}>
                  <span>Total Lifetime Orders</span>
                  <span className={styles.detailValue}>
                    {customer.totalOrders}
                  </span>
                </div>
                <div className={styles.detailRow}>
                  <span>Average Order Value</span>
                  <span className={styles.detailValue}>
                    ${customer.avgOrderValue.toFixed(2)}
                  </span>
                </div>
                <div className={styles.detailRow}>
                  <span>Return Rate</span>
                  <span className={styles.detailValueError}>
                    {customer.returnRate}
                  </span>
                </div>
              </div>
            </div>

            <div className={styles.footer}>
              <button className={styles.dossierButton} title="Integration Required">
                Generate Full Dossier
              </button>
            </div>

            <ConfirmModal
              open={restrictConfirmOpen}
              title="Restrict this customer's account?"
              message={`${customer.name}'s account will be disabled and they will not be able to log in.`}
              confirmLabel="Confirm Restrict"
              danger
              onCancel={() => setRestrictConfirmOpen(false)}
              onConfirm={() => {
                dispatch(deactivateCustomer(customer.id));
                setRestrictConfirmOpen(false);
              }}
            />
          </>
        )}
      </div>
    </>
  );
};

export default CustomerDrawer;