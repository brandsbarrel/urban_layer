import styles from './ShippingProgressBar.module.css';

function ShippingProgressBar({ progress, amountRemaining, isFree }) {
    return (
        <div className={styles.wrapper}>
            <div className={styles.header}>
                <span className={styles.label}>
                    {isFree
                        ? "You've unlocked Free Express Shipping!"
                        : `Add ₹${amountRemaining.toLocaleString('en-IN')} more for Free Express Shipping`}
                </span>
                <span className={styles.percentage}>{progress}%</span>
            </div>
            <div className={styles.track}>
                <div className={styles.fill} style={{ width: `${progress}%` }} />
            </div>
        </div>
    );
}

export default ShippingProgressBar;