import { MdCall, MdMail, MdChat, MdLocationOn } from 'react-icons/md';
import QuickContactCard from '../../../components/QuickContactCard/QuickContactCard';
import styles from './QuickContactSection.module.css';

const WHATSAPP_HREF = `https://wa.me/911234567890?text=${encodeURIComponent('Hi, I have a question.')}`;

function QuickContactSection() {
    const scrollToLocation = () => {
        document.getElementById('location-info')?.scrollIntoView({ behavior: 'smooth' });
    };

    return (
        <section className={styles.section}>
            <QuickContactCard
                icon={MdCall}
                title="Call Us"
                subtitle="Mon - Fri, 9am - 6pm"
                actionLabel="1800-123-4567"
                href="tel:18001234567"
            />
            <QuickContactCard
                icon={MdMail}
                title="Email"
                subtitle="24/7 Response Rate"
                actionLabel="concierge@urbanlayers.co"
                href="mailto:concierge@urbanlayers.co"
            />
            <QuickContactCard
                icon={MdChat}
                title="WhatsApp"
                subtitle="Immediate Support"
                actionLabel="Start Chat"
                href={WHATSAPP_HREF}
            />
            <QuickContactCard
                icon={MdLocationOn}
                title="Flagship Store"
                subtitle="Gurugram, Haryana"
                actionLabel="View on Map"
                onClick={scrollToLocation}
            />
        </section>
    );
}

export default QuickContactSection;