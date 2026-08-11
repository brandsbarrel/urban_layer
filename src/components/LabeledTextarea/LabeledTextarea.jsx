import styles from './LabeledTextarea.module.css';

function LabeledTextarea({ label, value, onChange, placeholder, rows = 4, required = true }) {
    return (
        <div className={styles.field}>
            <label className={styles.label}>{label}</label>
            <textarea
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                rows={rows}
                required={required}
                className={styles.textarea}
            />
        </div>
    );
}

export default LabeledTextarea;