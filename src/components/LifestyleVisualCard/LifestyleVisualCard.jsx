import { Link } from 'react-router-dom';
import styles from './LifestyleVisualCard.module.css';

function LifestyleVisualCard({ image, imageAlt, eyebrow, heading, path = '/collections' }) {
    return (
        <Link to={path} className={styles.card}>
            <img src={image} alt={imageAlt} className={styles.image} />
            <div className={styles.gradient} />
            <div className={styles.content}>
                <p className={styles.eyebrow}>{eyebrow}</p>
                <h4 className={styles.heading}>{heading}</h4>
            </div>
        </Link>
    );
}

export default LifestyleVisualCard;