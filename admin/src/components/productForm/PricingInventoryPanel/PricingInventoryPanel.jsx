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

      <div className={styles.twoCol}>
        <div className={styles.fieldGroup}>
          <label className={styles.label}>Cost Price</label>
          <div className={styles.priceWrapper}>
            <span className={styles.currencySign}>$</span>
            <input
              className={styles.priceInputRegular}
              type="text"
              placeholder="Optional"
              value={form.costPrice}
              onChange={set("costPrice")}
            />
          </div>
        </div>
        <div className={styles.fieldGroup}>
          <label className={styles.label}>Tax Rate (%)</label>
          <input
            className={styles.input}
            type="number"
            min="0"
            max="100"
            placeholder="0"
            value={form.taxRate}
            onChange={set("taxRate")}
          />
        </div>
      </div>

      <div className={styles.stockBox}>
        <div>
          <p className={styles.stockLabel}>Total Available</p>
          <input
            className={styles.input}
            type="number"
            min="0"
            value={form.totalStock}
            onChange={set("totalStock")}
          />
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
