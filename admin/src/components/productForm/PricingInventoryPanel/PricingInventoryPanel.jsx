import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { MdInventory } from "react-icons/md";
import { updateField } from "../../../redux/slices/productFormSlice";
import styles from "./PricingInventoryPanel.module.css";

const PricingInventoryPanel = () => {
  const dispatch = useDispatch();
  const form = useSelector((state) => state.productForm.form);

  const set = (field) => (e) =>
    dispatch(updateField({ field, value: e.target.value }));

  return (
    <section className={styles.card}>
      <h4 className={styles.title}>Pricing &amp; Inventory</h4>

      <div className={styles.twoCol}>
        <div className={styles.fieldGroup}>
          <label className={styles.label}>Base Price</label>
          <div className={styles.priceWrapper}>
            <span className={styles.currencySign}>$</span>
            <input
              className={styles.priceInput}
              type="text"
              value={form.basePrice}
              onChange={set("basePrice")}
            />
          </div>
        </div>
        <div className={styles.fieldGroup}>
          <label className={styles.label}>Sale Price</label>
          <div className={styles.priceWrapper}>
            <span className={styles.currencySign}>$</span>
            <input
              className={styles.priceInputRegular}
              type="text"
              placeholder="--"
              value={form.salePrice}
              onChange={set("salePrice")}
            />
          </div>
        </div>
      </div>

      <div className={styles.stockBox}>
        <div>
          <p className={styles.stockLabel}>Total Available</p>
          <p className={styles.stockValue}>{form.totalStock}</p>
        </div>
        <MdInventory className={styles.stockIcon} />
      </div>

      <label className={styles.checkboxRow}>
        <input
          type="checkbox"
          checked={form.trackStock}
          onChange={(e) =>
            dispatch(
              updateField({ field: "trackStock", value: e.target.checked })
            )
          }
        />
        <span>Track stock quantity</span>
      </label>
    </section>
  );
};

export default PricingInventoryPanel;