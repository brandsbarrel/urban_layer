import styles from './StatBentoCard.module.css';

function StatBentoCard({ icon: Icon, value, label, accent = 'primary' }) {
    return (
        <div className={styles.card}>
            <Icon size={22} className={accent === 'secondary' ? styles.iconSecondary : styles.iconPrimary} />
            <span className={styles.value}>{value}</span>
            <span className={styles.label}>{label}</span>
        </div>
    );
}

export default StatBentoCard;