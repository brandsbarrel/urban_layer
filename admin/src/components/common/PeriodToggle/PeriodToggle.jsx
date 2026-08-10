import React from "react";
import styles from "./PeriodToggle.module.css";

const OPTIONS = ["7D", "30D", "90D"];

const PeriodToggle = ({ value, onChange }) => {
  return (
    <div className={styles.group}>
      {OPTIONS.map((option) => (
        <button
          key={option}
          type="button"
          className={
            option === value
              ? `${styles.button} ${styles.buttonActive}`
              : styles.button
          }
          onClick={() => onChange(option)}
          aria-pressed={option === value}
        >
          {option}
        </button>
      ))}
    </div>
  );
};

export default PeriodToggle;