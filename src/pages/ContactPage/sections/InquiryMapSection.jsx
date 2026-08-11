import ContactFormSection from './ContactFormSection';
import LocationInfoSection from './LocationInfoSection';
import styles from './InquiryMapSection.module.css';

function InquiryMapSection() {
    return (
        <section className={styles.section}>
            <ContactFormSection />
            <LocationInfoSection />
        </section>
    );
}

export default InquiryMapSection;