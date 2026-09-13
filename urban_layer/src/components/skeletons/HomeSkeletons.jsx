import styles from './HomeSkeletons.module.css';

function Block({ className = '' }) {
  return <div className={`${styles.skeleton} ${className}`} aria-hidden="true" />;
}

export function HeroSkeleton() {
  return (
    <section className={styles.heroSkeleton} aria-label="Loading featured collection">
      <div className={styles.heroInner}>
        <Block className={styles.heroLineSmall} />
        <Block className={styles.heroLineLarge} />
        <Block className={styles.heroLineMedium} />
        <div className={styles.heroActions}>
          <Block className={styles.heroButton} />
          <Block className={styles.heroButton} />
        </div>
      </div>
    </section>
  );
}

export function DeviceCardSkeleton({ count = 4 }) {
  return (
    <div className={`${styles.grid} ${styles.grid4}`}>
      {Array.from({ length: count }).map((_, index) => (
        <div className={styles.deviceCard} key={index}>
          <Block className={styles.imageWide} />
          <Block className={styles.line} />
          <Block className={styles.lineShort} />
        </div>
      ))}
    </div>
  );
}

export function CategoryCardSkeleton({ count = 4 }) {
  return (
    <div className={`${styles.grid} ${styles.grid4}`}>
      {Array.from({ length: count }).map((_, index) => (
        <div className={styles.categoryCard} key={index}>
          <Block className={styles.imageWide} />
          <Block className={styles.line} />
          <Block className={styles.lineShort} />
          <Block className={styles.lineShort} />
        </div>
      ))}
    </div>
  );
}

export function ProductCardSkeleton({ count = 6 }) {
  return (
    <div className={`${styles.grid} ${styles.grid6}`}>
      {Array.from({ length: count }).map((_, index) => (
        <div className={styles.productCard} key={index}>
          <Block className={styles.pill} />
          <Block className={styles.imageSquare} />
          <Block className={styles.line} />
          <Block className={styles.lineShort} />
          <Block className={styles.lineShort} />
          <Block className={styles.button} />
        </div>
      ))}
    </div>
  );
}
