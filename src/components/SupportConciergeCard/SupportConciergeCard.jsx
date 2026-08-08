import { MdSupportAgent, MdChat, MdMail, MdArrowForward } from 'react-icons/md';
import styles from './SupportConciergeCard.module.css';

function SupportConciergeCard({
    phoneNumber = '911234567890',
    email = 'concierge@urbanlayers.co',
}) {
    const whatsappHref = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(
        'Hi, I need help with an order.'
    )}`;

    return (
        <div className={styles.card}>
            <MdSupportAgent size={160} className={styles.watermark} />
            <h3 className={styles.heading}>Need Help?</h3>
            <p className={styles.subtitle}>
                Our concierge team is available 24/7 for order inquiries and style advice.
            </p>
            <div className={styles.links}>
                <a href={whatsappHref} target="_blank" rel="noopener noreferrer" className={styles.link}>
                    <MdChat size={20} className={styles.linkIcon} />
                    <span>WhatsApp Concierge</span>
                    <MdArrowForward size={16} className={styles.arrowIcon} />
                </a>
                <a href={`mailto:${email}`} className={styles.link}>
                    <MdMail size={20} className={styles.linkIcon} />
                    <span>Email Support</span>
                    <MdArrowForward size={16} className={styles.arrowIcon} />
                </a>
            </div>
        </div>
    );
}

export default SupportConciergeCard;