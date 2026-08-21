import { MdInventory2 } from 'react-icons/md';
import styles from './OrderTrackingSummaryCard.module.css';

function OrderTrackingSummaryCard({ orderId, status, estimatedDelivery }) {
    return (
        <div className={styles.card}>
            <div className={styles.header}>
                <div>
                    <span className={styles.badge}>{status}</span>
                    <h2 className={styles.orderId}>{orderId}</h2>
                </div>
                <MdInventory2 size={24} className={styles.icon} />
            </div>
            <p className={styles.label}>Estimated Delivery</p>
            <p className={styles.value}>{estimatedDelivery}</p>
        </div>
    );
}

export default OrderTrackingSummaryCard;