import { Link } from 'react-router-dom';
import { MdLocalShipping } from 'react-icons/md';
import styles from './TrackingPreviewCard.module.css';

function TrackingPreviewCard({ image, locationLabel, orderId }) {
    return (
        <div className={styles.card}>
            <div className={styles.imageWrapper}>
                <img src={image} alt="Delivery route preview" className={styles.image} />
                <div className={styles.gradient} />
                <div className={styles.overlay}>
                    <span className={styles.pulseDot} />
                    <span>{locationLabel}</span>
                </div>
            </div>
            <div className={styles.buttonWrapper}>
                <Link to={`/track-order?order=${orderId}`} className={styles.trackButton}>
                    <MdLocalShipping size={20} />
                    Track Order
                </Link>
            </div>
        </div>
    );
}

export default TrackingPreviewCard;