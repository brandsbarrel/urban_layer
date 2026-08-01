import styles from './LabeledInput.module.css';

function LabeledInput({ label, type = 'text', value, onChange, placeholder, required = true }) {
    return (
        <div className={styles.field}>
            <label className={styles.label}>{label}</label>
            <input
                type={type}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                required={required}
                className={styles.input}
            />
        </div>
    );
}

export default LabeledInput;