import styles from './ToggleSwitch.module.css';

function ToggleSwitch({ checked, onChange, label }) {
    return (
        <label className={styles.wrapper} aria-label={label}>
            <input type="checkbox" checked={checked} onChange={onChange} className={styles.input} />
            <span className={styles.track}>
                <span className={styles.thumb} />
            </span>
        </label>
    );
}

export default ToggleSwitch;