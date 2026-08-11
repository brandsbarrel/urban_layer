import React from "react";
import { useSelector } from "react-redux";
import styles from "./PublishSettingsPanel.module.css";

const STATUS_DOT = { Draft: "dotDraft", Published: "dotPublished", Scheduled: "dotScheduled", Archived: "dotArchived" };

const PublishSettingsPanel = () => {
  const form = useSelector((state) => state.blogForm.form);

  return (
    <section className={styles.card}>
      <h4 className={styles.title}>Publish Settings</h4>
      <div className={styles.row}>
        <span>Status</span>
        <span className={styles.statusBadge}>
          <span className={`${styles.dot} ${styles[STATUS_DOT[form.status]]}`} />
          {form.status}
        </span>
      </div>
      <div className={styles.row}>
        <span>Publicly Visible</span>
        <span className={styles.value}>{form.publiclyVisible ? "Yes" : "No"}</span>
      </div>
      {form.scheduledDate && (
        <div className={styles.row}>
          <span>Scheduled For</span>
          <span className={styles.value}>{new Date(form.scheduledDate).toLocaleString()}</span>
        </div>
      )}
    </section>
  );
};

export default PublishSettingsPanel;