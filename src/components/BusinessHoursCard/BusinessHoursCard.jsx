import { MdSchedule } from 'react-icons/md';
import styles from './BusinessHoursCard.module.css';

function BusinessHoursCard({ hours }) {
  return (
    <div className={styles.card}>
      <h4 className={styles.heading}>
        <MdSchedule size={20} className={styles.icon} />
        Business Hours
      </h4>
      <ul className={styles.list}>
        {hours.map((item) => (
          <li key={item.day} className={styles.row}>
            <span>{item.day}:</span>
            <span>{item.hours}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default BusinessHoursCard;