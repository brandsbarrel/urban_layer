import { Link } from 'react-router-dom';
import styles from './CollectionMasonryCard.module.css';

function CollectionMasonryCard({ image, imageAlt, title, itemCount, priceFrom, path = '/shop' }) {
    return (
        <Link to={path} className={styles.card}>
            <img src={image} alt={imageAlt} className={styles.image} />
            <div className={styles.content}>
                <h4 className={styles.title}>{title}</h4>
                <div className={styles.meta}>
                    <span>{itemCount} Items</span>
                    <span>From {priceFrom}</span>
                </div>
            </div>
        </Link>
    );
}

export default CollectionMasonryCard;