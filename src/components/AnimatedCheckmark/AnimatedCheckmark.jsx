import styles from './AnimatedCheckmark.module.css';

function AnimatedCheckmark({ size = 128 }) {
    return (
        <div className={styles.wrapper} style={{ width: size, height: size }}>
            <svg className={styles.svg} viewBox="0 0 100 100">
                <circle
                    className={`${styles.shape} ${styles.ring}`}
                    cx="50"
                    cy="50"
                    r="45"
                    fill="none"
                    stroke="var(--color-secondary)"
                    strokeWidth="2"
                />
                <path
                    className={styles.shape}
                    d="M30 50 L45 65 L70 35"
                    fill="none"
                    stroke="var(--color-secondary)"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="3"
                />
            </svg>
        </div>
    );
}

export default AnimatedCheckmark;