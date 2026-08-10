import styles from './OrderStatCard.module.css';

function OrderStatCard({ label, value, accent = 'default' }) {
    return (
        <div className={styles.card}>
            <p className={styles.label}>{label}</p>
            <p className={accent === 'secondary' ? `${styles.value} ${styles.valueSecondary}` : styles.value}>
                {value}
            </p>
        </div>
    );
}

export default OrderStatCard;