import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { logout, selectAuth } from '../../../redux/slices/authSlice';
import styles from './DangerZoneSection.module.css';

function DangerZoneSection() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { user } = useSelector(selectAuth);

    const handleDelete = () => {
        const confirmed = window.confirm(
            'This will permanently delete your account and all associated data. Are you sure?'
        );
        if (confirmed) {
            dispatch(logout());
            navigate('/');
        }
    };

    const handleDeactivate = () => {
        const confirmed = window.confirm('Deactivate your account temporarily?');
        if (confirmed) {
            dispatch(logout());
            navigate('/');
        }
    };

    return (
        <section id="danger-zone" className={styles.section}>
            <h2 className={styles.heading}>Account Deactivation</h2>
            <p className={styles.text}>
                Deleting your account is permanent and will result in the loss of all Reward Points (
                {(user?.rewardPoints ?? 0).toLocaleString('en-IN')}), order history, and exclusive{' '}
                {user?.tier} Status benefits.
            </p>
            <div className={styles.actions}>
                <button type="button" onClick={handleDelete} className={styles.deleteButton}>
                    Delete Account
                </button>
                <button type="button" onClick={handleDeactivate} className={styles.deactivateButton}>
                    Deactivate Temporarily
                </button>
            </div>
        </section>
    );
}

export default DangerZoneSection;