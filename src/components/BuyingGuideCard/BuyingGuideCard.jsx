import { Link } from 'react-router-dom';
import styles from './BuyingGuideCard.module.css';

function BuyingGuideCard({ slug, label, image, title, excerpt, ctaLabel }) {
    return (
        <div className={styles.card}>
            <div className={styles.imageWrapper}>
                <img src={image} alt={title} className={styles.image} />
            </div>
            <span className={styles.label}>{label}</span>
            <h3 className={styles.title}>{title}</h3>
            <p className={styles.excerpt}>{excerpt}</p>
            <Link to={`/journal/${slug}`} className={styles.ctaButton}>
                {ctaLabel}
            </Link>
        </div>
    );
}

export default BuyingGuideCard;