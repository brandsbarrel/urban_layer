import { useState } from 'react';
import styles from './PromoCodeInput.module.css';

function PromoCodeInput({ appliedCode, error, onApply, onClear }) {
    const [value, setValue] = useState('');

    const handleApply = () => {
        if (!value.trim()) return;
        onApply(value.trim());
    };

    if (appliedCode) {
        return (
            <div className={styles.wrapper}>
                <label className={styles.label}>Promo Code</label>
                <div className={styles.appliedRow}>
                    <span className={styles.appliedCode}>{appliedCode} applied</span>
                    <button type="button" onClick={onClear} className={styles.clearButton}>
                        Remove
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className={styles.wrapper}>
            <label className={styles.label}>Promo Code</label>
            <div className={styles.inputRow}>
                <input
                    type="text"
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                    placeholder="Enter code"
                    className={styles.input}
                />
                <button type="button" onClick={handleApply} className={styles.applyButton}>
                    Apply
                </button>
            </div>
            {error && <p className={styles.error}>{error}</p>}
        </div>
    );
}

export default PromoCodeInput;