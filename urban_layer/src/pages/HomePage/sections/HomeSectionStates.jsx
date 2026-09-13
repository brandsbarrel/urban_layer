import styles from './HomeSectionStates.module.css';

export function SectionError({ message, onRetry }) {
  return (
    <div className={styles.state} role="status">
      <p>{message}</p>
      {onRetry && (
        <button type="button" onClick={onRetry} className={styles.button}>
          Try again
        </button>
      )}
    </div>
  );
}

export function EmptyState({ message }) {
  return (
    <div className={styles.state} role="status">
      <p>{message}</p>
    </div>
  );
}
