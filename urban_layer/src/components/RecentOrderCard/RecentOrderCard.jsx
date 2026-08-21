import { Link } from 'react-router-dom';
import styles from './RecentOrderCard.module.css';

const STATUS_LABELS = {
    confirmed: 'Confirmed',
    processing: 'Processing',
    shipped: 'In Transit',
    delivered: 'Delivered',
};

function RecentOrderCard({ order }) {
    const item = order.items[0];
    const statusLabel = STATUS_LABELS[order.status] || order.status;
    const orderDate = new Date(order.placedAt).toLocaleDateString('en-IN', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
    });

    return (
        <div className={styles.card}>
            <div className={styles.imageWrapper}>
                <img src={item.image} alt={item.name} className={styles.image} />
            </div>
            <div className={styles.info}>
                <div className={styles.statusRow}>
                    <span className={styles.statusDot} />
                    <span className={styles.statusLabel}>{statusLabel}</span>
                </div>
                <h3 className={styles.title}>{item.name}</h3>
                <p className={styles.meta}>
                    Order #{order.id} • Ordered {orderDate}
                </p>
                <div className={styles.actions}>
                    <Link to={`/track-order/${order.id}`} className={styles.trackButton}>
                        Track Order
                    </Link>
                    <Link to="/account/orders" className={styles.detailsButton}>
                        View Details
                    </Link>
                </div>
            </div>
        </div>
    );
}

export default RecentOrderCard;