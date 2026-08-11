import React from "react";
import { MdCheck, MdLocalShipping } from "react-icons/md";
import styles from "./TrackingTimeline.module.css";

const TrackingTimeline = ({ timeline }) => {
  return (
    <div>
      <h3 className={styles.title}>Tracking Timeline</h3>
      <div className={styles.list}>
        {timeline.map((step) => (
          <div
            key={step.id}
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
              <p className={styles.stepDate}>{step.date}</p>
              {step.note && <p className={styles.stepNote}>{step.note}</p>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TrackingTimeline;