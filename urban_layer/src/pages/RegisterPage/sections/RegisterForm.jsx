import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { FaGoogle, FaApple } from 'react-icons/fa';
import { MdArrowForward } from 'react-icons/md';
import FloatingLabelInput from '../../../components/FloatingLabelInput/FloatingLabelInput';
import CountryCodeSelect from '../../../components/CountryCodeSelect/CountryCodeSelect';
import PasswordInput from '../../../components/PasswordInput/PasswordInput';
import SocialLoginButtons from '../../../components/SocialLoginButtons/SocialLoginButtons';
import {
    registerStart,
    registerSuccess,
    registerFailure,
    selectAuth,
} from '../../../redux/slices/authSlice';
import { registerUser } from '../../../services/authService';
import styles from './RegisterForm.module.css';

const REGISTER_SOCIAL_PROVIDERS = [
    { id: 'google', label: 'Google', icon: FaGoogle },
    { id: 'apple', label: 'Apple', icon: FaApple },
];

function RegisterForm() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { status, error } = useSelector(selectAuth);

    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [countryCode, setCountryCode] = useState('+91');
    const [mobile, setMobile] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [consent, setConsent] = useState(false);
    const [formError, setFormError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setFormError('');

        if (password !== confirmPassword) {
            setFormError('Passwords do not match.');
            return;
        }

        dispatch(registerStart());
        try {
            
            

            const user = await registerUser({
                name: fullName,
                email,
                mobile: `${countryCode}${mobile}`,
                password,
            });
            dispatch(registerSuccess(user));
            navigate('/');
        } catch (err) {
            dispatch(registerFailure(err.message));
        }
    };

    return (
        <div className={styles.card}>
            <header className={styles.header}>
                <h2 className={styles.heading}>Create Your Account</h2>
                <p className={styles.subheading}>Experience the art of protection.</p>
            </header>

            <form className={styles.form} onSubmit={handleSubmit}>
                <FloatingLabelInput
                    id="full_name"
                    label="Full Name"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                />

                <FloatingLabelInput
                    id="email"
                    label="Email Address"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />

                <div className={styles.mobileRow}>
                    <CountryCodeSelect value={countryCode} onChange={(e) => setCountryCode(e.target.value)} />
                    <div className={styles.mobileInput}>
                        <FloatingLabelInput
                            id="mobile"
                            label="Mobile Number"
                            type="tel"
                            value={mobile}
                            onChange={(e) => setMobile(e.target.value)}
                        />
                    </div>
                </div>

                <PasswordInput
                    id="password"
                    label="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    variant="floating"
                    showStrengthMeter
                />

                <PasswordInput
                    id="confirm_password"
                    label="Confirm Password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    variant="floating"
                />

                <div className={styles.consentRow}>
                    <input
                        id="consent"
                        type="checkbox"
                        checked={consent}
                        onChange={(e) => setConsent(e.target.checked)}
                        required
                        className={styles.consentCheckbox}
                    />
                    <label htmlFor="consent" className={styles.consentLabel}>
                        I agree to the <Link to="/terms-conditions">Terms of Service</Link> and{' '}
                        <Link to="/privacy-policy">Privacy Policy</Link>. Send me occasional updates and
                        offers.
                    </label>
                </div>

                {(formError || error) && <p className={styles.errorText}>{formError || error}</p>}

                <button type="submit" className={styles.submitButton} disabled={status === 'loading'}>
                    <span className={styles.submitLabel}>
                        {status === 'loading' ? 'CREATING ACCOUNT...' : 'CREATE ACCOUNT'}
                    </span>
                    <MdArrowForward size={18} className={styles.submitIcon} />
                </button>

                <div className={styles.divider}>
                    <span className={styles.dividerText}>OR</span>
                </div>

                <SocialLoginButtons providers={REGISTER_SOCIAL_PROVIDERS} showLabels />
            </form>

            <footer className={styles.footer}>
                <p className={styles.footerText}>
                    Already have an account?
                    <Link to="/login" className={styles.footerLink}>
                        Sign In
                    </Link>
                </p>
            </footer>
        </div>
    );
}

export default RegisterForm;