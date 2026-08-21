import styles from './OrderDetailHeaderCard.module.css';

function OrderDetailHeaderCard({ orderId, placedDateLabel, total, statusLabel }) {
    return (
        <div className={styles.card}>
            <div className={styles.left}>
                <h1 className={styles.heading}>Order #{orderId}</h1>
                <p className={styles.subtitle}>Placed on {placedDateLabel}</p>
            </div>
            <div className={styles.right}>
                <div className={styles.totalBlock}>
                    <span className={styles.totalLabel}>Total</span>
                    <span className={styles.totalValue}>₹{total.toLocaleString('en-IN')}</span>
                </div>
                <div className={styles.divider} />
                <span className={styles.statusBadge}>{statusLabel}</span>
            </div>
        </div>
    );
}

export default OrderDetailHeaderCard;