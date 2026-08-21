import { MdDownload, MdChat } from 'react-icons/md';
import styles from './InvoiceSupportActions.module.css';

function InvoiceSupportActions({ orderId, phoneNumber = '911234567890' }) {
    const whatsappHref = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(
        `Hi, I need help with order #${orderId}.`
    )}`;

    const handleDownloadInvoice = () => {
        // Mock — real PDF invoice generation would connect here
        console.log(`Downloading invoice for order ${orderId}`);
    };

    return (
        <div className={styles.wrapper}>
            <button type="button" onClick={handleDownloadInvoice} className={styles.invoiceButton}>
                <MdDownload size={20} />
                Download Invoice
            </button>
            <a href={whatsappHref} target="_blank" rel="noopener noreferrer" className={styles.whatsappButton}>
                <MdChat size={20} />
                WhatsApp Support
            </a>
        </div>
    );
}

export default InvoiceSupportActions;