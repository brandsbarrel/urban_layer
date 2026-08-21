import { useState } from 'react';
import LabeledInput from '../../../components/LabeledInput/LabeledInput';
import FloatingSelect from '../../../components/FloatingSelect/FloatingSelect';
import LabeledTextarea from '../../../components/LabeledTextarea/LabeledTextarea';
import { inquiryCategoryOptions } from '../../../services/contactPageData';
import styles from './ContactFormSection.module.css';

const EMPTY_FORM = {
    fullName: '',
    email: '',
    orderNumber: '',
    category: 'general',
    subject: '',
    message: '',
};

function ContactFormSection() {
    const [form, setForm] = useState(EMPTY_FORM);
    const [status, setStatus] = useState('idle'); // idle | sending | sent

    const update = (field) => (e) => setForm((prev) => ({ ...prev, [field]: e.target.value }));

    const handleSubmit = (e) => {
        e.preventDefault();
        setStatus('sending');
        setTimeout(() => {
            setStatus('sent');
            setForm(EMPTY_FORM);
            setTimeout(() => setStatus('idle'), 3000);
        }, 1200);
    };

    return (
        <div id="contact-form" className={styles.card}>
            <div className={styles.header}>
                <h2 className={styles.heading}>Inquiry Form</h2>
                <p className={styles.subtitle}>
                    Please fill out the form below and our concierge team will reach out within 4 hours.
                </p>
            </div>

            <form className={styles.form} onSubmit={handleSubmit}>
                <div className={styles.row}>
                    <LabeledInput label="Full Name" value={form.fullName} onChange={update('fullName')} placeholder="Aniket Sharma" />
                    <LabeledInput label="Email Address" type="email" value={form.email} onChange={update('email')} placeholder="aniket@example.com" />
                </div>
                <div className={styles.row}>
                    <LabeledInput
                        label="Order Number (Optional)"
                        value={form.orderNumber}
                        onChange={update('orderNumber')}
                        placeholder="#UL-9981"
                        required={false}
                    />
                    <FloatingSelect
                        id="category"
                        label="Category"
                        value={form.category}
                        onChange={update('category')}
                        options={inquiryCategoryOptions}
                    />
                </div>
                <LabeledInput label="Subject" value={form.subject} onChange={update('subject')} placeholder="How can we help?" />
                <LabeledTextarea
                    label="Message"
                    value={form.message}
                    onChange={update('message')}
                    placeholder="Details about your inquiry..."
                />

                <button type="submit" className={styles.submitButton} disabled={status !== 'idle'}>
                    {status === 'sending' ? 'Sending...' : status === 'sent' ? 'Inquiry Sent ✓' : 'Submit Inquiry'}
                </button>
            </form>
        </div>
    );
}

export default ContactFormSection;