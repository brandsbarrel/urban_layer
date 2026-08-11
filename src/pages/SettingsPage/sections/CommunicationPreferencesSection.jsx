import { useDispatch, useSelector } from 'react-redux';
import ToggleSwitch from '../../../components/ToggleSwitch/ToggleSwitch';
import { selectAuth, updateCommunicationPrefs } from '../../../redux/slices/authSlice';
import styles from './CommunicationPreferencesSection.module.css';

const TOGGLES = [
    {
        key: 'emailUpdates',
        title: 'Email Updates',
        description: 'New collections, editorial stories, and exclusive early access.',
    },
    {
        key: 'smsNotifications',
        title: 'SMS Notifications',
        description: 'Order status updates and urgent delivery alerts.',
    },
    {
        key: 'whatsappConcierge',
        title: 'WhatsApp Concierge',
        description: 'Personalized styling advice and direct access to your account manager.',
    },
];

function CommunicationPreferencesSection() {
    const dispatch = useDispatch();
    const { user } = useSelector(selectAuth);
    const prefs = user?.communicationPrefs || {};

    const handleToggle = (key) => (e) => {
        dispatch(updateCommunicationPrefs({ [key]: e.target.checked }));
    };

    return (
        <section id="communications" className={styles.section}>
            <h2 className={styles.heading}>Communication Preferences</h2>
            <div className={styles.list}>
                {TOGGLES.map((toggle, index) => (
                    <div key={toggle.key}>
                        <div className={styles.row}>
                            <div>
                                <h3 className={styles.title}>{toggle.title}</h3>
                                <p className={styles.description}>{toggle.description}</p>
                            </div>
                            <ToggleSwitch
                                checked={Boolean(prefs[toggle.key])}
                                onChange={handleToggle(toggle.key)}
                                label={toggle.title}
                            />
                        </div>
                        {index < TOGGLES.length - 1 && <div className={styles.divider} />}
                    </div>
                ))}
            </div>
        </section>
    );
}

export default CommunicationPreferencesSection;