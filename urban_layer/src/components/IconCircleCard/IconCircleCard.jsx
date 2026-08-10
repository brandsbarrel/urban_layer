import { Link } from 'react-router-dom';
import styles from './IconCircleCard.module.css';

function IconCircleCard({ icon: Icon, label, path }) {
    const content = (
        <>
            <div className={styles.iconCircle}>
                <Icon size={28} />
            </div>
            <h4 className={styles.label}>{label}</h4>
        </>
    );

    if (path) {
        return (
            <Link to={path} className={styles.card}>
                {content}
            </Link>
        );
    }

    return <div className={styles.card}>{content}</div>;
}

export default IconCircleCard;