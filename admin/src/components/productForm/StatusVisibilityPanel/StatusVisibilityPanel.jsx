import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { updateField } from "../../../redux/slices/productFormSlice";
import styles from "./StatusVisibilityPanel.module.css";

const STATUS_DOT = {
  Draft: "statusDotDraft",
  Published: "statusDotPublished",
  Archived: "statusDotArchived",
};

const StatusVisibilityPanel = () => {
  const dispatch = useDispatch();
  const form = useSelector((state) => state.productForm.form);

  return (
    <section className={styles.card}>
      <h4 className={styles.title}>Status &amp; Visibility</h4>
      <div className={styles.row}>
        <span>Status</span>
        <span className={styles.statusBadge}>
          <span className={`${styles.dot} ${styles[STATUS_DOT[form.status]]}`} />
          {form.status}
        </span>
      </div>
      <div className={styles.row}>
        <span>Visibility</span>
        <select
          className={styles.select}
          value={form.visibility}
          onChange={(e) =>
            dispatch(
              updateField({ field: "visibility", value: e.target.value })
            )
          }
        >
          <option>Public</option>
          <option>Private</option>
          <option>Hidden</option>
        </select>
      </div>
      <div className={styles.row}>
        <span>Schedule</span>
        <button className={styles.scheduleButton} title="Integration Required">
          Publish Immediately
        </button>
      </div>
    </section>
  );
};

export default StatusVisibilityPanel;