import { Link } from 'react-router-dom';
import styles from './CategoryCollectionCard.module.css';

function CategoryCollectionCard({ image, imageAlt, categoryLabel, title, productCount, path = '/shop' }) {
    return (
        <Link to={path} className={styles.card}>
            <div className={styles.imageWrapper}>
                <img src={image} alt={imageAlt} className={styles.image} />
            </div>
            <div className={styles.content}>
                <span className={styles.category}>{categoryLabel}</span>
                <h3 className={styles.title}>{title}</h3>
                <p className={styles.count}>{productCount} Products</p>
            </div>
            <div className={styles.hoverBorder} />
        </Link>
    );
}

export default CategoryCollectionCard;