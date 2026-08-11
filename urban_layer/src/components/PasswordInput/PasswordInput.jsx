import { useState } from 'react';
import { MdVisibility, MdVisibilityOff } from 'react-icons/md';
import PasswordStrengthMeter from '../PasswordStrengthMeter/PasswordStrengthMeter';
import styles from './PasswordInput.module.css';

function PasswordInput({
    id,
    label,
    value,
    onChange,
    placeholder = '••••••••',
    labelSlot,
    required = true,
    variant = 'static',
    showStrengthMeter = false,
}) {
    const [isVisible, setIsVisible] = useState(false);
    const isFloating = variant === 'floating';

    return (
        <div className={styles.field}>
            {!isFloating && (
                <div className={styles.labelRow}>
                    <label htmlFor={id} className={styles.label}>
                        {label}
                    </label>
                    {labelSlot}
                </div>
            )}
            <div className={styles.inputWrapper}>
                <input
                    id={id}
                    type={isVisible ? 'text' : 'password'}
                    placeholder={isFloating ? ' ' : placeholder}
                    value={value}
                    onChange={onChange}
                    required={required}
                    className={isFloating ? styles.floatingInput : styles.input}
                />
                {isFloating && (
                    <label htmlFor={id} className={styles.floatingLabel}>
                        {label}
                    </label>
                )}
                <button
                    type="button"
                    className={isFloating ? styles.floatingToggleButton : styles.toggleButton}
                    onClick={() => setIsVisible((prev) => !prev)}
                    aria-label={isVisible ? 'Hide password' : 'Show password'}
                >
                    {isVisible ? <MdVisibilityOff size={20} /> : <MdVisibility size={20} />}
                </button>
            </div>
            {showStrengthMeter && <PasswordStrengthMeter password={value} />}
        </div>
    );
}

export default PasswordInput;