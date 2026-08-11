import FloatingWhatsAppButton from '../../components/FloatingWhatsAppButton/FloatingWhatsAppButton';
import ContactHeroSection from './sections/ContactHeroSection';
import QuickContactSection from './sections/QuickContactSection';
import InquiryMapSection from './sections/InquiryMapSection';
import FAQSection from './sections/FAQSection';
import SocialMediaSection from './sections/SocialMediaSection';
import ContactNewsletterSection from './sections/ContactNewsletterSection';
import styles from './ContactPage.module.css';

function ContactPage() {
    return (
        <div className={styles.page}>
            <ContactHeroSection />
            <QuickContactSection />
            <InquiryMapSection />
            <FAQSection />
            <SocialMediaSection />
            <ContactNewsletterSection />
            <FloatingWhatsAppButton message="Hi, I have a question about Urban Layers." />
        </div>
    );
}

export default ContactPage;