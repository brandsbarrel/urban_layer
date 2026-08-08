import styles from './ReferralCard.module.css';

function ReferralCard({ image, imageAlt, badge, heading, description, ctaLabel, onInvite }) {
    return (
        <div className={styles.card} style={{ backgroundImage: `url('${image}')` }}>
            <div className={styles.gradient} />
            <div className={styles.content}>
                <span className={styles.badge}>{badge}</span>
                <h3 className={styles.heading}>{heading}</h3>
                <p className={styles.description}>{description}</p>
                <button type="button" onClick={onInvite} className={styles.ctaButton}>
                    {ctaLabel}
                </button>
            </div>
        </div>
    );
}

export default ReferralCard;