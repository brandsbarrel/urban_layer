import styles from './MembershipProgressCard.module.css';

function MembershipProgressCard({
    badgeLabel,
    heading,
    description,
    progress,
    currentLabel,
    goalLabel,
    perks,
}) {
    return (
        <div className={styles.card}>
            <div className={styles.glow} />
            <div className={styles.grid}>
                <div>
                    <span className={styles.badge}>{badgeLabel}</span>
                    <h2 className={styles.heading}>{heading}</h2>
                    <p className={styles.description}>{description}</p>
                    <div className={styles.track}>
                        <div className={styles.fill} style={{ width: `${progress}%` }} />
                    </div>
                    <div className={styles.labels}>
                        <span>{currentLabel}</span>
                        <span>{goalLabel}</span>
                    </div>
                </div>
                <div className={styles.perksGrid}>
                    {perks.map((perk) => (
                        <div key={perk.label} className={styles.perk}>
                            <perk.icon size={20} className={styles.perkIcon} />
                            <p className={styles.perkLabel}>{perk.label}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default MembershipProgressCard;