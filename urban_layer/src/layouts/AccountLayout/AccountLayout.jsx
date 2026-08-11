import { Outlet, Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import AccountSidebar from '../../components/AccountSidebar/AccountSidebar';
import FloatingWhatsAppButton from '../../components/FloatingWhatsAppButton/FloatingWhatsAppButton';
import { selectAuth } from '../../redux/slices/authSlice';
import styles from './AccountLayout.module.css';

function AccountLayout() {
    const { user, isAuthenticated } = useSelector(selectAuth);

    if (!isAuthenticated || !user || user.isGuest) {
        return (
            <div className={styles.guestPrompt}>
                <h1 className={styles.guestHeading}>Sign In to View Your Account</h1>
                <p className={styles.guestText}>
                    Log in to access your orders, wishlist, rewards, and personalized dashboard.
                </p>
                <Link to="/login" className={styles.guestLink}>
                    Go to Login
                </Link>
            </div>
        );
    }

    return (
        <div className={styles.page}>
            <div className={styles.layout}>
                <AccountSidebar user={user} />
                <main className={styles.main}>
                    <Outlet />
                </main>
            </div>
            <FloatingWhatsAppButton />
        </div>
    );
}

export default AccountLayout;