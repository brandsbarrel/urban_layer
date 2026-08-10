import styles from './TimelineItem.module.css';

function TimelineItem({ year, title, description, active }) {
    return (
        <div className={styles.item}>
            <div className={`${styles.badge} ${active ? styles.badgeActive : ''}`}>
                <span>{year}</span>
            </div>
            <div className={styles.card}>
                <h5 className={styles.title}>{title}</h5>
                <p className={styles.description}>{description}</p>
            </div>
        </div>
    );
}

export default TimelineItem;