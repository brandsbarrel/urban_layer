import { Link } from 'react-router-dom';
import LabeledInput from '../../../components/LabeledInput/LabeledInput';
import styles from './ContactInfoSection.module.css';

function ContactInfoSection({ contactInfo, onChange }) {
    return (
        <section>
            <div className={styles.header}>
                <h2 className={styles.heading}>Contact Information</h2>
                <span className={styles.loginPrompt}>
                    Already have an account?{' '}
                    <Link to="/login" className={styles.loginLink}>
                        Log in
                    </Link>
                </span>
            </div>
            <div className={styles.card}>
                <div className={styles.grid}>
                    <LabeledInput
                        label="Email Address"
                        type="email"
                        value={contactInfo.email}
                        onChange={(e) => onChange({ ...contactInfo, email: e.target.value })}
                        placeholder="alexander@prestige.com"
                    />
                    <LabeledInput
                        label="Phone Number"
                        type="tel"
                        value={contactInfo.phone}
                        onChange={(e) => onChange({ ...contactInfo, phone: e.target.value })}
                        placeholder="+91 98765 43210"
                    />
                </div>
            </div>
        </section>
    );
}

export default ContactInfoSection;