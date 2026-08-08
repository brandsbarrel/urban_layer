import styles from './InfoDetailCard.module.css';

function InfoDetailCard({ icon: Icon, title, children }) {
    return (
        <div className={styles.card}>
            <div className={styles.header}>
                <Icon size={22} className={styles.icon} />
                <h3 className={styles.title}>{title}</h3>
            </div>
            <div className={styles.content}>{children}</div>
        </div>
    );
}

export default InfoDetailCard;