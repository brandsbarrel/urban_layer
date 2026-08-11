import styles from './IconFeatureCard.module.css';

function IconFeatureCard({ icon: Icon, title, description, variant = 'light' }) {
  const isDark = variant === 'dark';
  const isPlain = variant === 'plain';
  const isBento = variant === 'bento';

  if (isBento) {
    return (
      <div className={styles.cardBento}>
        <Icon size={36} className={styles.iconBento} />
        <h3 className={styles.titleBento}>{title}</h3>
        <p className={styles.descriptionBento}>{description}</p>
      </div>
    );
  }

  if (isPlain) {
    return (
      <div className={styles.cardPlain}>
        <Icon size={48} className={styles.iconPlain} />
        <h3 className={styles.titlePlain}>{title}</h3>
        <p className={styles.descriptionPlain}>{description}</p>
      </div>
    );
  }

  return (
    <div className={isDark ? styles.cardDark : styles.card}>
      {isDark ? (
        <Icon size={48} className={styles.iconDark} />
      ) : (
        <div className={styles.iconWrapper}>
          <Icon size={28} />
        </div>
      )}
      <h4 className={isDark ? styles.titleDark : styles.title}>{title}</h4>
      <p className={isDark ? styles.descriptionDark : styles.description}>{description}</p>
    </div>
  );
}

export default IconFeatureCard;