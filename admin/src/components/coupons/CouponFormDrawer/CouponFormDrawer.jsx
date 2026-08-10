import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { MdClose } from "react-icons/md";
import { closeFormDrawer, saveCoupon, emptyForm } from "../../../redux/slices/couponsSlice";
import styles from "./CouponFormDrawer.module.css";

const CouponFormDrawer = () => {
  const dispatch = useDispatch();
  const { formDrawerOpen, editingId, items } = useSelector((state) => state.coupons);
  const editingCoupon = items.find((c) => c.id === editingId);
  const [form, setForm] = useState(emptyForm);
  const [error, setError] = useState("");

  useEffect(() => {
    if (editingCoupon) {
      setForm({
        id: editingCoupon.id,
        code: editingCoupon.code,
        title: editingCoupon.title,
        subtitle: editingCoupon.subtitle,
        discountType: editingCoupon.discountType,
        discountValue: editingCoupon.discountValue,
        minOrderValue: editingCoupon.minOrderValue,
        maxRedemption: editingCoupon.maxRedemption,
        startDate: editingCoupon.startDate,
        endDate: editingCoupon.endDate,
        status: editingCoupon.status,
      });
    } else {
      setForm(emptyForm);
    }
    setError("");
  }, [editingId, formDrawerOpen]);

  const set = (field) => (e) => setForm((prev) => ({ ...prev, [field]: e.target.value }));

  const handleSave = () => {
    if (!form.code.trim() || !form.discountValue || !form.startDate || !form.endDate) {
      setError("Code, Discount Value, Start Date, and End Date are required.");
      return;
    }
    dispatch(saveCoupon({ ...form, title: form.title || form.code }));
  };

  return (
    <>
      <div className={`${styles.overlay} ${formDrawerOpen ? styles.overlayOpen : ""}`} onClick={() => dispatch(closeFormDrawer())} />
      <div className={`${styles.drawer} ${formDrawerOpen ? styles.drawerOpen : ""}`}>
        <div className={styles.header}>
          <h3 className={styles.title}>{editingId ? "Edit Coupon" : "Create Coupon"}</h3>
          <button className={styles.closeButton} onClick={() => dispatch(closeFormDrawer())}>
            <MdClose />
          </button>
        </div>
        <div className={styles.body}>
          <div className={styles.field}>
            <label>Coupon Code</label>
            <input type="text" value={form.code} onChange={set("code")} placeholder="e.g. SUMMER24" />
          </div>
          <div className={styles.field}>
            <label>Campaign Title</label>
            <input type="text" value={form.title} onChange={set("title")} placeholder="e.g. Summer Sale" />
          </div>
          <div className={styles.field}>
            <label>Subtitle</label>
            <input type="text" value={form.subtitle} onChange={set("subtitle")} />
          </div>
          <div className={styles.row}>
            <div className={styles.field}>
              <label>Discount Type</label>
              <select value={form.discountType} onChange={set("discountType")}>
                <option>Percentage</option>
                <option>Fixed Amount</option>
                <option>BOGO</option>
              </select>
            </div>
            <div className={styles.field}>
              <label>Discount Value</label>
              <input type="text" value={form.discountValue} onChange={set("discountValue")} placeholder="25" />
            </div>
          </div>
          <div className={styles.row}>
            <div className={styles.field}>
              <label>Minimum Order</label>
              <input type="text" value={form.minOrderValue} onChange={set("minOrderValue")} placeholder="150.00" />
            </div>
            <div className={styles.field}>
              <label>Usage Limit</label>
              <input type="text" value={form.maxRedemption} onChange={set("maxRedemption")} placeholder="Unlimited" />
            </div>
          </div>
          <div className={styles.row}>
            <div className={styles.field}>
              <label>Start Date</label>
              <input type="date" value={form.startDate} onChange={set("startDate")} />
            </div>
            <div className={styles.field}>
              <label>End Date</label>
              <input type="date" value={form.endDate} onChange={set("endDate")} />
            </div>
          </div>
          {error && <p className={styles.error}>{error}</p>}
        </div>
        <div className={styles.footer}>
          <button className={styles.cancelButton} onClick={() => dispatch(closeFormDrawer())}>
            Discard
          </button>
          <button className={styles.saveButton} onClick={handleSave}>
            {editingId ? "Save Changes" : "Create Coupon"}
          </button>
        </div>
      </div>
    </>
  );
};

export default CouponFormDrawer;