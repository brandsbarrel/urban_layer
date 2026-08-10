import { Link } from 'react-router-dom';
import styles from './DeviceCategoryCard.module.css';

function DeviceCategoryCard({ icon: Icon, label, path }) {
    return (
        <Link to={path} className={styles.card}>
            <div className={styles.content}>
                <Icon size={40} className={styles.icon} />
                <span className={styles.label}>{label}</span>
            </div>
            <div className={styles.hoverTint} />
        </Link>
    );
}

export default DeviceCategoryCard;