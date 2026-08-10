import { FaWhatsapp } from 'react-icons/fa';
import styles from './FloatingWhatsAppButton.module.css';

function FloatingWhatsAppButton({
    phoneNumber = '911234567890', // placeholder — real support number se replace karna
    message = 'Hi, I need help with my order.',
}) {
    const href = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;

    return (
        <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.button}
            aria-label="Contact support on WhatsApp"
        >
            <FaWhatsapp size={28} />
            <span className={styles.tooltip}>Contact Support</span>
        </a>
    );
}

export default FloatingWhatsAppButton;