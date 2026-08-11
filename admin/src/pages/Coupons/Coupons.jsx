import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { MdAutoAwesome, MdBolt, MdAdd } from "react-icons/md";
import { fetchCoupons, openCreateDrawer } from "../../redux/slices/couponsSlice";
import CouponStatsRow from "../../components/coupons/CouponStatsRow/CouponStatsRow";
import CouponToolbar from "../../components/coupons/CouponToolbar/CouponToolbar";
import CampaignGrid from "../../components/coupons/CampaignGrid/CampaignGrid";
import CouponDetailsDrawer from "../../components/coupons/CouponDetailsDrawer/CouponDetailsDrawer";
import CouponFormDrawer from "../../components/coupons/CouponFormDrawer/CouponFormDrawer";
import styles from "./Coupons.module.css";

const Coupons = () => {
  const dispatch = useDispatch();
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);

  React.useEffect(() => {
    if (isAuthenticated) {
      dispatch(fetchCoupons());
    }
  }, [dispatch, isAuthenticated]);

  return (
    <div className={styles.page}>
      <div className={styles.pageHeader}>
        <div>
          <h1 className={styles.title}>Coupons &amp; Offers</h1>
          <p className={styles.subtitle}>
            Manage all promotional campaigns, discount codes, flash sales, and seasonal offers.
          </p>
        </div>
        <div className={styles.headerActions}>
          <button className={styles.secondaryButton} title="Coming Soon">
            <MdAutoAwesome /> Create Offer Banner
          </button>
          <button className={styles.secondaryButton} title="Coming Soon">
            <MdBolt /> Create Flash Sale
          </button>
          <button className={styles.primaryButton} onClick={() => dispatch(openCreateDrawer())}>
            <MdAdd /> Create Coupon
          </button>
        </div>
      </div>

      <CouponStatsRow />
      <CouponToolbar />
      <CampaignGrid />

      <CouponDetailsDrawer />
      <CouponFormDrawer />
    </div>
  );
};

export default Coupons;
