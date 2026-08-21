import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import ProfileHeroBanner from './sections/ProfileHeroBanner';
import SettingsSidebarNav from './sections/SettingsSidebarNav';
import PersonalInfoSection from './sections/PersonalInfoSection';
import SecurityHubSection from './sections/SecurityHubSection';
import CommunicationPreferencesSection from './sections/CommunicationPreferencesSection';
import DangerZoneSection from './sections/DangerZoneSection';
import StickySaveBar from '../../components/StickySaveBar/StickySaveBar';
import { selectAuth, updateProfile } from '../../redux/slices/authSlice';
import styles from './SettingsPage.module.css';

function SettingsPage() {
    const dispatch = useDispatch();
    const { user } = useSelector(selectAuth);

    const [profileForm, setProfileForm] = useState({
        fullName: user.fullName,
        email: user.email,
        phone: user.phone,
        currency: user.currency,
        language: user.language,
    });
    const [passwordForm, setPasswordForm] = useState({ currentPassword: '', newPassword: '' });
    const [lastSavedLabel, setLastSavedLabel] = useState('Last saved: 12 minutes ago');

    const handleSaveAll = () => {
        dispatch(updateProfile(profileForm));
        if (passwordForm.newPassword) {
            // Mock — real password change would call an API here
            console.log('Password updated (mock)');
        }
        setPasswordForm({ currentPassword: '', newPassword: '' });
        setLastSavedLabel('Last saved: just now');
    };

    return (
        <div className={styles.page}>
            <ProfileHeroBanner user={user} />

            <div className={styles.contentGrid}>
                <SettingsSidebarNav pointsToNextTier={user.pointsToNextTier} nextTier={user.nextTier} />

                <div className={styles.sectionsColumn}>
                    <PersonalInfoSection form={profileForm} onChange={setProfileForm} />
                    <SecurityHubSection passwordForm={passwordForm} onPasswordChange={setPasswordForm} />
                    <CommunicationPreferencesSection />
                    <DangerZoneSection />
                </div>
            </div>

            <StickySaveBar lastSavedLabel={lastSavedLabel} onSave={handleSaveAll} />
        </div>
    );
}

export default SettingsPage;