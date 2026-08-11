import styles from './CategoryIconCard.module.css';

function CategoryIconCard({ icon: Icon, label, isActive, onClick }) {
    return (
        <button
            type="button"
            onClick={onClick}
            className={isActive ? `${styles.card} ${styles.cardActive}` : styles.card}
        >
            <div className={isActive ? `${styles.iconCircle} ${styles.iconCircleActive}` : styles.iconCircle}>
                <Icon size={22} />
            </div>
            <span className={styles.label}>{label}</span>
        </button>
    );
}

export default CategoryIconCard;