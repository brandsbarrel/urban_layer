import FloatingLabelInput from '../../../components/FloatingLabelInput/FloatingLabelInput';
import FloatingSelect from '../../../components/FloatingSelect/FloatingSelect';
import { profileAvatarImage, currencyOptions, languageOptions } from '../../../services/settingsPageData';
import styles from './PersonalInfoSection.module.css';

function PersonalInfoSection({ form, onChange }) {
    const update = (field) => (e) => onChange({ ...form, [field]: e.target.value });

    const handleUpload = () => {
        // Mock — real file upload flow would connect here
        console.log('Upload photo clicked');
    };

    const handleRemove = () => {
        console.log('Remove photo clicked');
    };

    return (
        <section id="personal-info" className={styles.section}>
            <h2 className={styles.heading}>Personal Information</h2>
            <div className={styles.layout}>
                <div className={styles.photoColumn}>
                    <div className={styles.photoWrapper}>
                        <img src={profileAvatarImage} alt="Profile" className={styles.photo} />
                    </div>
                    <div className={styles.photoActions}>
                        <button type="button" onClick={handleUpload} className={styles.uploadButton}>
                            Upload
                        </button>
                        <button type="button" onClick={handleRemove} className={styles.removeButton}>
                            Remove
                        </button>
                    </div>
                </div>

                <div className={styles.formGrid}>
                    <FloatingLabelInput
                        id="full-name"
                        label="Full Name"
                        value={form.fullName}
                        onChange={update('fullName')}
                    />
                    <FloatingLabelInput
                        id="email"
                        label="Email Address"
                        type="email"
                        value={form.email}
                        onChange={update('email')}
                    />
                    <FloatingLabelInput
                        id="phone"
                        label="Phone Number"
                        type="tel"
                        value={form.phone}
                        onChange={update('phone')}
                    />
                    <div className={styles.selectRow}>
                        <FloatingSelect
                            id="currency"
                            label="Currency"
                            value={form.currency}
                            onChange={update('currency')}
                            options={currencyOptions}
                        />
                        <FloatingSelect
                            id="language"
                            label="Language"
                            value={form.language}
                            onChange={update('language')}
                            options={languageOptions}
                        />
                    </div>
                </div>
            </div>
        </section>
    );
}

export default PersonalInfoSection;