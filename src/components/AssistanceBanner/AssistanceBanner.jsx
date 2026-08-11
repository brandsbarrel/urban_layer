import { MdChat, MdMail, MdCall } from 'react-icons/md';
import styles from './AssistanceBanner.module.css';

function AssistanceBanner({
    heading = 'Need Assistance?',
    subtitle = 'Our dedicated concierge team is available 24/7 to assist with your delivery needs.',
    whatsappLabel = 'WhatsApp Concierge',
    emailLabel = 'Email Support',
    callLabel = 'Call Atelier',
    phoneNumber = '911234567890',
    email = 'concierge@urbanlayers.co',
    callNumber = '+911234567890',
}) {
    const whatsappHref = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(
        'Hi, I need help.'
    )}`;

    return (
        <section className={styles.section}>
            <div className={styles.dotPattern} />
            <div className={styles.content}>
                <h2 className={styles.heading}>{heading}</h2>
                <p className={styles.subtitle}>{subtitle}</p>
                <div className={styles.buttons}>
                    <a href={whatsappHref} target="_blank" rel="noopener noreferrer" className={styles.solidButton}>
                        <MdChat size={20} />
                        {whatsappLabel}
                    </a>
                    <a href={`mailto:${email}`} className={styles.outlineButton}>
                        <MdMail size={20} />
                        {emailLabel}
                    </a>
                    <a href={`tel:${callNumber}`} className={styles.outlineButton}>
                        <MdCall size={20} />
                        {callLabel}
                    </a>
                </div>
            </div>
        </section>
    );
}

export default AssistanceBanner;