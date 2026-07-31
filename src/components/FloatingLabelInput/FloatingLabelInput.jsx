import styles from './FloatingLabelInput.module.css';

function FloatingLabelInput({ id, label, type = 'text', value, onChange, required = true, autoComplete }) {
  return (
    <div className={styles.group}>
      <input
        id={id}
        type={type}
        placeholder=" "
        value={value}
        onChange={onChange}
        required={required}
        autoComplete={autoComplete}
        className={styles.input}
      />
      <label htmlFor={id} className={styles.label}>
        {label}
      </label>
    </div>
  );
}

export default FloatingLabelInput;