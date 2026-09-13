import { Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';
import AccountSidebar from '../../components/AccountSidebar/AccountSidebar';
import FloatingWhatsAppButton from '../../components/FloatingWhatsAppButton/FloatingWhatsAppButton';
import { selectAuth } from '../../redux/slices/authSlice';
import styles from './AccountLayout.module.css';

function AccountLayout() {
    const { user } = useSelector(selectAuth);

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
