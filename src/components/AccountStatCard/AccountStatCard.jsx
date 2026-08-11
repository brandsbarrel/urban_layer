import styles from './AccountStatCard.module.css';

function AccountStatCard({ icon: Icon, label, value, accent = 'default' }) {
    return (
        <div className={styles.card}>
            <div className={accent === 'secondary' ? `${styles.iconCircle} ${styles.iconCircleSecondary}` : styles.iconCircle}>
                <Icon size={22} />
            </div>
            <div>
                <p className={styles.label}>{label}</p>
                <p className={styles.value}>{value}</p>
            </div>
        </div>
    );
}

export default AccountStatCard;