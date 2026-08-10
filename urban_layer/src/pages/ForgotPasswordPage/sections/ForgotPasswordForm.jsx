import { useState } from 'react';
import { Link } from 'react-router-dom';
import { MdMail, MdSmartphone, MdArrowBack, MdChat, MdSupportAgent } from 'react-icons/md';
import { sendPasswordResetLink } from '../../../services/authService';
import styles from './ForgotPasswordForm.module.css';

const METHODS = {
    email: {
        label: 'Email Address',
        placeholder: 'e.g. name@urbanlayers.co',
        inputType: 'email',
        ctaLabel: 'Send Reset Link',
    },
    phone: {
        label: 'Mobile Number',
        placeholder: 'e.g. +91 98765 43210',
        inputType: 'tel',
        ctaLabel: 'Send SMS Link',
    },
};

function ForgotPasswordForm() {
    const [method, setMethod] = useState('email');
    const [value, setValue] = useState('');
    const [status, setStatus] = useState('idle'); // idle | loading | success | error
    const [error, setError] = useState('');

    const activeMethod = METHODS[method];

    const handleMethodChange = (nextMethod) => {
        setMethod(nextMethod);
        setValue('');
        setStatus('idle');
        setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!value) return;
        setStatus('loading');
        try {
            await sendPasswordResetLink({ method, value });
            setStatus('success');
        } catch (err) {
            setStatus('error');
            setError(err.message);
        }
    };

    return (
        <div className={styles.wrapper}>
            <div className={styles.header}>
                <h2 className={styles.heading}>Reset Your Password</h2>
                <p className={styles.subheading}>
                    Choose your preferred recovery method to receive a secure link.
                </p>
            </div>

            <div className={styles.methodToggle}>
                <button
                    type="button"
                    className={
                        method === 'email' ? `${styles.methodButton} ${styles.methodButtonActive}` : styles.methodButton
                    }
                    onClick={() => handleMethodChange('email')}
                >
                    <MdMail size={24} />
                    <span className={styles.methodButtonLabel}>Email Address</span>
                </button>
                <button
                    type="button"
                    className={
                        method === 'phone' ? `${styles.methodButton} ${styles.methodButtonActive}` : styles.methodButton
                    }
                    onClick={() => handleMethodChange('phone')}
                >
                    <MdSmartphone size={24} />
                    <span className={styles.methodButtonLabel}>Mobile Number</span>
                </button>
            </div>

            {status === 'success' ? (
                <p className={styles.successMessage}>
                    🎉 Recovery link sent! Please check your {method === 'email' ? 'inbox' : 'messages'}.
                </p>
            ) : (
                <form className={styles.form} onSubmit={handleSubmit}>
                    <div className={styles.field}>
                        <label htmlFor="recovery-input" className={styles.label}>
                            {activeMethod.label}
                        </label>
                        <input
                            id="recovery-input"
                            type={activeMethod.inputType}
                            placeholder={activeMethod.placeholder}
                            value={value}
                            onChange={(e) => setValue(e.target.value)}
                            required
                            className={styles.input}
                        />
                    </div>

                    {status === 'error' && <p className={styles.errorText}>{error}</p>}

                    <button type="submit" className={styles.submitButton} disabled={status === 'loading'}>
                        {status === 'loading' ? 'Sending...' : activeMethod.ctaLabel}
                    </button>
                </form>
            )}

            <div className={styles.secondaryActions}>
                <Link to="/login" className={styles.backLink}>
                    <MdArrowBack size={18} />
                    Back to Login
                </Link>
                <div className={styles.newAccountRow}>
                    <span>New to Urban Layers?</span>
                    <Link to="/register" className={styles.newAccountLink}>
                        Create New Account
                    </Link>
                </div>
            </div>

            <div className={styles.assistance}>
                <p className={styles.assistanceLabel}>Need Assistance?</p>
                <div className={styles.assistanceLinks}>
                    <a href="#" className={styles.assistanceLink}>
                        <MdChat size={18} className={styles.whatsappIcon} />
                        WhatsApp
                    </a>
                    <a href="#" className={styles.assistanceLink}>
                        <MdSupportAgent size={18} className={styles.supportIcon} />
                        Email Support
                    </a>
                </div>
            </div>
        </div>
    );
}

export default ForgotPasswordForm;