import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { MdArrowForward } from 'react-icons/md';
import PasswordInput from '../../../components/PasswordInput/PasswordInput';
import {
    loginStart,
    loginSuccess,
    loginFailure,
    continueAsGuest,
    selectAuth,
} from '../../../redux/slices/authSlice';
import { loginUser } from '../../../services/authService';
import styles from './LoginForm.module.css';
import brandMark from '../../../assets/auth-brand-mark.png';

function LoginForm() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();
    const { status, error } = useSelector(selectAuth);

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [rememberMe, setRememberMe] = useState(false);

    const handleSubmit = async (e) => {
    e.preventDefault();

    dispatch(loginStart());

    try {
        const customer = await loginUser({
            email,
            password,
        });

        dispatch(loginSuccess(customer));

        const from = location.state?.from;
        const destination = from
            ? `${from.pathname}${from.search || ''}${from.hash || ''}`
            : '/account';
        navigate(destination, { replace: true });
    } catch (err) {
        dispatch(loginFailure(err.message));
    }
};

    const handleGuest = () => {
        localStorage.removeItem('customerAccessToken');
        dispatch(continueAsGuest());
        navigate('/');
    };

    return (
        <div className={styles.wrapper}>
            <div className={styles.header}>
                <img src={brandMark} alt="Urban Layers Co. mark" className={styles.logo} />
                <div>
                    <h2 className={styles.heading}>Welcome Back</h2>
                    <p className={styles.subheading}>Secure access to your luxury collection.</p>
                </div>
            </div>

            {location.state?.message && <p className={styles.successText}>{location.state.message}</p>}

            <div className={styles.card}>
                <form className={styles.form} onSubmit={handleSubmit}>
                    <div className={styles.field}>
                        <label htmlFor="email" className={styles.label}>
                            Email Address
                        </label>
                        <input
                            id="email"
                            type="email"
                            placeholder="name@domain.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className={styles.input}
                        />
                    </div>

                    <PasswordInput
                        id="password"
                        label="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        labelSlot={
                            <Link to="/forgot-password" className={styles.forgotLink}>
                                Forgot Password?
                            </Link>
                        }
                    />

                    <div className={styles.rememberRow}>
                        <input
                            id="remember"
                            type="checkbox"
                            checked={rememberMe}
                            onChange={(e) => setRememberMe(e.target.checked)}
                            className={styles.checkbox}
                        />
                        <label htmlFor="remember" className={styles.rememberLabel}>
                            Remember this device
                        </label>
                    </div>

                    {error && <p className={styles.errorText}>{error}</p>}

                    <button type="submit" className={styles.submitButton} disabled={status === 'loading'}>
                        {status === 'loading' ? 'Signing In...' : 'Sign In'}
                        <MdArrowForward size={18} />
                    </button>
                </form>

            </div>

            <div className={styles.footerActions}>
                <button type="button" onClick={handleGuest} className={styles.guestButton}>
                    Continue as Guest
                </button>
                <p className={styles.registerText}>
                    New to the Urban Circle?
                    <Link to="/register" className={styles.registerLink}>
                        Create Account
                    </Link>
                </p>
            </div>

            <footer className={styles.footerLinks}>
                <Link to="/privacy-policy" className={styles.footerLink}>
                    Privacy Policy
                </Link>
                <Link to="/terms-conditions" className={styles.footerLink}>
                    Terms of Service
                </Link>
                <Link to="/support" className={styles.footerLink}>
                    Support
                </Link>
            </footer>
        </div>
    );
}

export default LoginForm;
