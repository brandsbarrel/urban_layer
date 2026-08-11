import styles from './StatCounter.module.css';

function StatCounter({ value, label }) {
    return (
        <div className={styles.stat}>
            <div className={styles.value}>{value}</div>
            <div className={styles.label}>{label}</div>
        </div>
    );
}

export default StatCounter;