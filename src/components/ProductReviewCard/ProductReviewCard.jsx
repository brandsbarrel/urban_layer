import { MdCheckCircle } from 'react-icons/md';
import StarRating from '../StarRating/StarRating';
import styles from './ProductReviewCard.module.css';

function ProductReviewCard({ title, quote, name, rating, verified = true }) {
    return (
        <div className={styles.card}>
            <div className={styles.header}>
                <StarRating rating={rating} />
                {verified && (
                    <span className={styles.verifiedBadge}>
                        <MdCheckCircle size={14} />
                        Verified
                    </span>
                )}
            </div>
            <p className={styles.title}>"{title}"</p>
            <p className={styles.quote}>"{quote}"</p>
            <p className={styles.name}>— {name}</p>
        </div>
    );
}

export default ProductReviewCard;