import React from "react";
import { MdCheck, MdLocalShipping } from "react-icons/md";
import styles from "./TrackingTimeline.module.css";

const TrackingTimeline = ({ timeline = [] }) => {
  const formatStepDate = (step) => {
    if (step.date) return step.date;
    const rawDate = step.createdAt || step.timestamp;
    if (!rawDate) return "";
    return new Date(rawDate).toLocaleString("en-US", {
      month: "short",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true
    });
  };

  return (
    <div>
      <h3 className={styles.title}>Tracking Timeline</h3>
      <div className={styles.list}>
        {timeline.map((step) => (
          <div
            key={step.id || step.title}
            className={step.done ? styles.item : `${styles.item} ${styles.itemFuture}`}
          >
            <div
              className={
                step.active
                  ? `${styles.dot} ${styles.dotActive}`
                  : step.done
                  ? `${styles.dot} ${styles.dotDone}`
                  : `${styles.dot} ${styles.dotFuture}`
              }
            >
              {step.done && (step.active ? <MdLocalShipping /> : <MdCheck />)}
            </div>
            <div>
              <p
                className={
                  step.active
                    ? `${styles.stepTitle} ${styles.stepTitleActive}`
                    : styles.stepTitle
                }
              >
                {step.title}
              </p>
              <p className={styles.stepDate}>{formatStepDate(step)}</p>
              {step.note && <p className={styles.stepNote}>{step.note}</p>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TrackingTimeline;