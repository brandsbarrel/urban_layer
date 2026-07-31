import { Link } from 'react-router-dom';
import styles from './CategoryImageCard.module.css';

function CategoryImageCard({ image, imageAlt, icon: Icon, label, path = '/shop' }) {
    return (
        <Link to={path} className={styles.card}>
            <img src={image} alt={imageAlt} className={styles.image} />
            <div className={styles.gradient} />
            <div className={styles.content}>
                <Icon size={22} className={styles.icon} />
                <h3 className={styles.label}>{label}</h3>
            </div>
        </Link>
    );
}

export default CategoryImageCard;