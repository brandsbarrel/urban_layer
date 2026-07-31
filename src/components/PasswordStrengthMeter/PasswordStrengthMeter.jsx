import styles from './PasswordStrengthMeter.module.css';

function calculateStrength(password) {
    let strength = 0;
    if (password.length > 5) strength++;
    if (password.length > 8 && /[A-Z]/.test(password)) strength++;
    if (password.length > 10 && /[0-9]/.test(password)) strength++;
    if (password.length > 12 && /[^A-Za-z0-9]/.test(password)) strength++;
    return strength;
}

function PasswordStrengthMeter({ password }) {
    const strength = calculateStrength(password || '');

    return (
        <div className={styles.meter}>
            {[0, 1, 2, 3].map((index) => (
                <div
                    key={index}
                    className={index < strength ? `${styles.segment} ${styles.segmentActive}` : styles.segment}
                />
            ))}
        </div>
    );
}

export default PasswordStrengthMeter;