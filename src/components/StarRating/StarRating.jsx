import { FaStar, FaRegStar } from 'react-icons/fa';
import styles from './StarRating.module.css';

function StarRating({ rating = 5, max = 5 }) {
    return (
        <div className={styles.stars}>
            {Array.from({ length: max }).map((_, index) =>
                index < rating ? (
                    <FaStar key={index} className={styles.filled} />
                ) : (
                    <FaRegStar key={index} className={styles.empty} />
                )
            )}
        </div>
    );
}

export default StarRating;