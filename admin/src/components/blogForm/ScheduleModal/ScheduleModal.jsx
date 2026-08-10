import React, { useState } from "react";
import styles from "./ScheduleModal.module.css";

// Section 25: Schedule requires a future publish date/time before the
// transition is allowed.
const ScheduleModal = ({ open, onCancel, onConfirm }) => {
  const [dateTime, setDateTime] = useState("");
  const [error, setError] = useState("");

  if (!open) return null;

  const handleConfirm = () => {
    if (!dateTime) {
      setError("Please choose a publish date and time.");
      return;
    }
    if (new Date(dateTime).getTime() <= Date.now()) {
      setError("Scheduled time must be in the future.");
      return;
    }
    onConfirm(dateTime);
    setDateTime("");
    setError("");
  };

  return (
    <div className={styles.overlay} onClick={onCancel}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <h3 className={styles.title}>Schedule Publication</h3>
        <div className={styles.field}>
          <label>Publish Date &amp; Time</label>
          <input type="datetime-local" value={dateTime} onChange={(e) => setDateTime(e.target.value)} />
        </div>
        {error && <p className={styles.error}>{error}</p>}
        <div className={styles.actions}>
          <button className={styles.cancelButton} onClick={onCancel}>
            Cancel
          </button>
          <button className={styles.confirmButton} onClick={handleConfirm}>
            Confirm Schedule
          </button>
        </div>
      </div>
    </div>
  );
};

export default ScheduleModal;