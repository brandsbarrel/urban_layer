import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { MdAdd, MdDelete } from "react-icons/md";
import {
  updateVariantField,
  removeVariant,
} from "../../../redux/slices/productFormSlice";
import styles from "./VariantsSection.module.css";

const VariantsSection = () => {
  const dispatch = useDispatch();
  const variants = useSelector((state) => state.productForm.form.variants);

  return (
    <section className={styles.card}>
      <div className={styles.headerRow}>
        <h3 className={styles.title}>Product Variants</h3>
        <button className={styles.generateButton} title="Integration Required">
          <MdAdd /> Generate Variations
        </button>
      </div>
      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <thead>
            <tr className={styles.headRow}>
              <th className={styles.headCell}>Variation</th>
              <th className={styles.headCell}>Material</th>
              <th className={styles.headCell}>Stock</th>
              <th className={styles.headCell}>Price Adjustment</th>
              <th className={`${styles.headCell} ${styles.alignRight}`}>
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {variants.map((variant) => (
              <tr key={variant.id} className={styles.row}>
                <td className={styles.cell}>{variant.name}</td>
                <td className={styles.cell}>
                  <span
                    className={
                      variant.materialTone === "highlight"
                        ? `${styles.materialBadge} ${styles.materialHighlight}`
                        : `${styles.materialBadge} ${styles.materialDefault}`
                    }
                  >
                    {variant.material}
                  </span>
                </td>
                <td className={styles.cell}>
                  <input
                    className={styles.miniInput}
                    type="number"
                    value={variant.stock}
                    onChange={(e) =>
                      dispatch(
                        updateVariantField({
                          variantId: variant.id,
                          field: "stock",
                          value: Number(e.target.value),
                        })
                      )
                    }
                  />
                </td>
                <td className={styles.cell}>
                  <input
                    className={styles.miniInput}
                    type="text"
                    value={variant.priceAdjustment}
                    onChange={(e) =>
                      dispatch(
                        updateVariantField({
                          variantId: variant.id,
                          field: "priceAdjustment",
                          value: e.target.value,
                        })
                      )
                    }
                  />
                </td>
                <td className={`${styles.cell} ${styles.alignRight}`}>
                  <button
                    className={styles.deleteButton}
                    onClick={() => dispatch(removeVariant(variant.id))}
                    aria-label={`Delete variant ${variant.name}`}
                  >
                    <MdDelete />
                  </button>
                </td>
              </tr>
            ))}
            {variants.length === 0 && (
              <tr>
                <td colSpan={5} className={styles.emptyCell}>
                  No variants yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
};

export default VariantsSection;