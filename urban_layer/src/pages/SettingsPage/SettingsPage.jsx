import { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { MdCheckCircle, MdEdit, MdSave } from 'react-icons/md';
import { selectAuth, updateProfile as updateProfileState } from '../../redux/slices/authSlice';
import { updateProfile as saveProfile } from '../../services/authService';
import styles from './SettingsPage.module.css';

function SettingsPage() {
    const dispatch = useDispatch();
    const { user } = useSelector(selectAuth);
    const initialForm = useMemo(() => ({
        name: user?.name || '',
        fullName: user?.fullName || user?.name || '',
        email: user?.email || '',
        phone: user?.phone || '',
        location: user?.location || '',
        currency: user?.currency || 'INR',
        language: user?.language || 'EN',
        memberSince: user?.memberSince || '',
        communicationPrefs: {
            emailUpdates: user?.communicationPrefs?.emailUpdates ?? true,
            smsNotifications: user?.communicationPrefs?.smsNotifications ?? true,
            whatsappConcierge: user?.communicationPrefs?.whatsappConcierge ?? false,
        },
    }), [user]);
    const [form, setForm] = useState(initialForm);
    const [saved, setSaved] = useState(false);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        setForm(initialForm);
    }, [initialForm]);

    const updateField = (field) => (event) => {
        setSaved(false);
        setError('');
        setForm((current) => ({ ...current, [field]: event.target.value }));
    };

    const updatePreference = (field) => (event) => {
        setSaved(false);
        setError('');
        setForm((current) => ({
            ...current,
            communicationPrefs: {
                ...current.communicationPrefs,
                [field]: event.target.checked,
            },
        }));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setSaving(true);
        setError('');

        try {
            const profile = await saveProfile(form);
            dispatch(updateProfileState(profile || form));
            setSaved(true);
        } catch (err) {
            dispatch(updateProfileState(form));
            setError(err.message || 'Profile saved locally, but server update failed.');
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className={styles.page}>
            <div className={styles.header}>
                <div>
                    <span className={styles.kicker}>Account Settings</span>
                    <h1 className={styles.title}>Profile Details</h1>
                </div>
                {saved && (
                    <span className={styles.savedBadge}>
                        <MdCheckCircle size={18} />
                        Saved
                    </span>
                )}
            </div>

            <form className={styles.form} onSubmit={handleSubmit}>
                <section className={styles.panel}>
                    <div className={styles.panelHeader}>
                        <MdEdit size={20} />
                        <h2 className={styles.panelTitle}>Personal Information</h2>
                    </div>

                    <div className={styles.grid}>
                        <label className={styles.field}>
                            <span className={styles.label}>Display Name</span>
                            <input className={styles.input} value={form.name} onChange={updateField('name')} />
                        </label>
                        <label className={styles.field}>
                            <span className={styles.label}>Full Name</span>
                            <input className={styles.input} value={form.fullName} onChange={updateField('fullName')} />
                        </label>
                        <label className={styles.field}>
                            <span className={styles.label}>Email Address</span>
                            <input className={styles.input} type="email" value={form.email} onChange={updateField('email')} />
                        </label>
                        <label className={styles.field}>
                            <span className={styles.label}>Phone Number</span>
                            <input className={styles.input} value={form.phone} onChange={updateField('phone')} />
                        </label>
                        <label className={styles.field}>
                            <span className={styles.label}>Location</span>
                            <input className={styles.input} value={form.location} onChange={updateField('location')} />
                        </label>
                        <label className={styles.field}>
                            <span className={styles.label}>Member Since</span>
                            <input className={styles.input} value={form.memberSince} onChange={updateField('memberSince')} />
                        </label>
                        <label className={styles.field}>
                            <span className={styles.label}>Currency</span>
                            <select className={styles.input} value={form.currency} onChange={updateField('currency')}>
                                <option value="INR">INR</option>
                                <option value="USD">USD</option>
                            </select>
                        </label>
                        <label className={styles.field}>
                            <span className={styles.label}>Language</span>
                            <select className={styles.input} value={form.language} onChange={updateField('language')}>
                                <option value="EN">English</option>
                                <option value="HI">Hindi</option>
                            </select>
                        </label>
                    </div>
                </section>

                <section className={styles.panel}>
                    <div className={styles.panelHeader}>
                        <MdCheckCircle size={20} />
                        <h2 className={styles.panelTitle}>Communication</h2>
                    </div>

                    <div className={styles.preferenceList}>
                        <label className={styles.preference}>
                            <input
                                type="checkbox"
                                checked={form.communicationPrefs.emailUpdates}
                                onChange={updatePreference('emailUpdates')}
                            />
                            <span>Email updates</span>
                        </label>
                        <label className={styles.preference}>
                            <input
                                type="checkbox"
                                checked={form.communicationPrefs.smsNotifications}
                                onChange={updatePreference('smsNotifications')}
                            />
                            <span>SMS notifications</span>
                        </label>
                        <label className={styles.preference}>
                            <input
                                type="checkbox"
                                checked={form.communicationPrefs.whatsappConcierge}
                                onChange={updatePreference('whatsappConcierge')}
                            />
                            <span>WhatsApp concierge</span>
                        </label>
                    </div>
                </section>

                {error && <p className={styles.errorMessage}>{error}</p>}

                <button className={styles.saveButton} type="submit" disabled={saving}>
                    <MdSave size={18} />
                    {saving ? 'Saving...' : 'Save Changes'}
                </button>
            </form>
        </div>
    );
}

export default SettingsPage;
