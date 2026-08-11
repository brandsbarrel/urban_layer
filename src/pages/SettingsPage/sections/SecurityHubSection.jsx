import { useState } from 'react';
import { MdVerifiedUser, MdLaptopMac, MdSmartphone } from 'react-icons/md';
import PasswordInput from '../../../components/PasswordInput/PasswordInput';
import ActiveDeviceItem from '../../../components/ActiveDeviceItem/ActiveDeviceItem';
import { initialActiveDevices } from '../../../services/settingsPageData';
import styles from './SecurityHubSection.module.css';

const DEVICE_ICON_MAP = {
    laptop: MdLaptopMac,
    phone: MdSmartphone,
};

function SecurityHubSection({ passwordForm, onPasswordChange }) {
    const [devices, setDevices] = useState(initialActiveDevices);

    const handleSignOut = (id) => {
        setDevices((prev) => prev.filter((d) => d.id !== id));
    };

    return (
        <section id="security" className={styles.section}>
            <div className={styles.header}>
                <h2 className={styles.heading}>Security Hub</h2>
                <span className={styles.protectionBadge}>
                    <MdVerifiedUser size={16} />
                    Enhanced Protection Active
                </span>
            </div>

            <div className={styles.grid}>
                <div className={styles.passwordColumn}>
                    <h3 className={styles.subheading}>Update Password</h3>
                    <div className={styles.passwordFields}>
                        <PasswordInput
                            id="current-pass"
                            label="Current Password"
                            value={passwordForm.currentPassword}
                            onChange={(e) =>
                                onPasswordChange({ ...passwordForm, currentPassword: e.target.value })
                            }
                            variant="floating"
                            required={false}
                        />
                        <PasswordInput
                            id="new-pass"
                            label="New Password"
                            value={passwordForm.newPassword}
                            onChange={(e) => onPasswordChange({ ...passwordForm, newPassword: e.target.value })}
                            variant="floating"
                            showStrengthMeter
                            required={false}
                        />
                    </div>
                </div>

                <div className={styles.devicesColumn}>
                    <h3 className={styles.subheading}>Active Devices</h3>
                    <div className={styles.devicesList}>
                        {devices.map((device) => (
                            <ActiveDeviceItem
                                key={device.id}
                                icon={DEVICE_ICON_MAP[device.icon]}
                                name={device.name}
                                meta={device.meta}
                                isCurrent={device.isCurrent}
                                onSignOut={() => handleSignOut(device.id)}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}

export default SecurityHubSection;