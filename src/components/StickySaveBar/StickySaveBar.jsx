import styles from './StickySaveBar.module.css';

function StickySaveBar({ lastSavedLabel, onSave }) {
    return (
        <div className={styles.bar}>
            <div className={styles.inner}>
                <p className={styles.savedText}>{lastSavedLabel}</p>
                <button type="button" onClick={onSave} className={styles.saveButton}>
                    Save All Changes
                </button>
            </div>
        </div>
    );
}

export default StickySaveBar;