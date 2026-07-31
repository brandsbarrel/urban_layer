import styles from './WishlistStatCard.module.css';

function WishlistStatCard({ label, value }) {
    return (
        <div className={styles.card}>
            <span className={styles.label}>{label}</span>
            <span className={styles.value}>{value}</span>
        </div>
    );
}

export default WishlistStatCard;