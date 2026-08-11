import React from "react";
import { useSelector } from "react-redux";
import styles from "./StickyActionBar.module.css";

const StickyActionBar = ({ onDiscard, onSaveDraft, onPublish, saving = false }) => {
  const isDirty = useSelector((state) => state.productForm.isDirty);

  return (
    <div className={styles.bar}>
      <div className={styles.statusText}>
        <span
          className={
            isDirty ? `${styles.dot} ${styles.dotUnsaved}` : styles.dot
          }
        />
        {isDirty ? "Unsaved changes" : "All changes saved automatically"}
      </div>
      <div className={styles.actions}>
        <button className={styles.discardButton} onClick={onDiscard}>
          Discard Changes
        </button>
        <button className={styles.draftButton} onClick={onSaveDraft} disabled={saving}>
          {saving ? "Saving..." : "Save Draft"}
        </button>
        <button className={styles.publishButton} onClick={onPublish} disabled={saving}>
          {saving ? "Saving..." : "Publish & Go Live"}
        </button>
      </div>
    </div>
  );
};

export default StickyActionBar;
