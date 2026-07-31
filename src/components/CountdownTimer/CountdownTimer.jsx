import { useEffect, useState } from 'react';
import styles from './CountdownTimer.module.css';

function getTargetDate(days, hours, minutes) {
  const target = new Date();
  target.setDate(target.getDate() + days);
  target.setHours(target.getHours() + hours);
  target.setMinutes(target.getMinutes() + minutes);
  return target;
}

function calculateRemaining(target) {
  const diff = Math.max(0, target - new Date());
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((diff / (1000 * 60)) % 60);
  return { days, hours, minutes };
}

function CountdownTimer({ days = 2, hours = 14, minutes = 45 }) {
  // Target date ek baar hi compute hota hai (lazy init), re-renders pe dobara nahi
  const [target] = useState(() => getTargetDate(days, hours, minutes));
  const [remaining, setRemaining] = useState(() => calculateRemaining(target));

  useEffect(() => {
    const interval = setInterval(() => {
      setRemaining(calculateRemaining(target));
    }, 60000);
    return () => clearInterval(interval);
  }, [target]);

  const units = [
    { value: remaining?.days ?? 0, label: 'Days' },
    { value: remaining?.hours ?? 0, label: 'Hours' },
    { value: remaining?.minutes ?? 0, label: 'Mins' },
  ];

  return (
    <div className={styles.timer}>
      {units.map((unit) => (
        <div key={unit.label} className={styles.unit}>
          <span className={styles.value}>{String(unit.value).padStart(2, '0')}</span>
          <span className={styles.label}>{unit.label}</span>
        </div>
      ))}
    </div>
  );
}

export default CountdownTimer;