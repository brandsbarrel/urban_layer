import StarRating from '../StarRating/StarRating';
import styles from './TestimonialCard.module.css';

function TestimonialCard({ quote, name, role, rating }) {
    return (
        <div className={styles.card}>
            <StarRating rating={rating} />
            <p className={styles.quote}>"{quote}"</p>
            <div className={styles.author}>
                <div className={styles.avatar} />
                <div>
                    <p className={styles.name}>{name}</p>
                    <p className={styles.role}>{role}</p>
                </div>
            </div>
        </div>
    );
}

export default TestimonialCard;