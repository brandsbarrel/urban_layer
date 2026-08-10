import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import {
    MdDashboard,
    MdInventory2,
    MdFavoriteBorder,
    MdLocationOn,
    MdStars,
    MdSettings,
    MdLogout,
    MdMenu,
    MdClose,
} from 'react-icons/md';
import { logout } from '../../redux/slices/authSlice';
import styles from './AccountSidebar.module.css';

const NAV_ITEMS = [
    { icon: MdDashboard, label: 'Dashboard', path: '/account' },
    { icon: MdInventory2, label: 'Orders', path: '/account/orders' },
    { icon: MdFavoriteBorder, label: 'Wishlist', path: '/wishlist' },
    { icon: MdLocationOn, label: 'Addresses', path: '/account/addresses' },
    { icon: MdStars, label: 'Rewards', path: '/account/rewards' },
    { icon: MdSettings, label: 'Settings', path: '/account/settings' },
];

function AccountSidebar({ user }) {
    const location = useLocation();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [isOpen, setIsOpen] = useState(false);

    const closeDrawer = () => setIsOpen(false);

    const handleLogout = () => {
        dispatch(logout());
        navigate('/');
        closeDrawer();
    };

    return (
        <>
            {/* Mobile-only trigger — full-width bar above content */}
            <button
                type="button"
                className={styles.mobileTrigger}
                onClick={() => setIsOpen(true)}
                aria-label="Open account menu"
            >
                <MdMenu size={22} />
                <span>Account Menu</span>
            </button>

            <aside className={`${styles.sidebar} ${isOpen ? styles.sidebarOpen : ''}`}>
                <button
                    type="button"
                    onClick={closeDrawer}
                    className={styles.closeButton}
                    aria-label="Close account menu"
                >
                    <MdClose size={22} />
                </button>

                <div className={styles.userBlock}>
                    <div className={styles.avatar}>{user?.avatarInitial || user?.name?.[0] || 'U'}</div>
                    <div>
                        <h3 className={styles.userName}>{user?.name || 'Guest'}</h3>
                        {user?.tier && <span className={styles.tierBadge}>{user.tier} Status</span>}
                    </div>
                </div>

                <nav className={styles.nav}>
                    {NAV_ITEMS.map((item) => (
                        <Link
                            key={item.path}
                            to={item.path}
                            onClick={closeDrawer}
                            className={
                                location.pathname === item.path
                                    ? `${styles.navLink} ${styles.navLinkActive}`
                                    : styles.navLink
                            }
                        >
                            <item.icon size={20} />
                            <span>{item.label}</span>
                        </Link>
                    ))}
                </nav>

                <button type="button" onClick={handleLogout} className={styles.logoutButton}>
                    <MdLogout size={20} />
                    <span>Logout</span>
                </button>
            </aside>

            {isOpen && <div className={styles.backdrop} onClick={closeDrawer} />}
        </>
    );
}

export default AccountSidebar;