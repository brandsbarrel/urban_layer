import FullBleedHero from '../../../components/FullBleedHero/FullBleedHero';
import { contactHeroImage } from '../../../services/contactPageData';

function ContactHeroSection() {
    const scrollToForm = () => {
        document.getElementById('contact-form')?.scrollIntoView({ behavior: 'smooth' });
    };

    return (
        <FullBleedHero
            image={contactHeroImage}
            imageAlt="Luxury boutique interior"
            align="left"
            overlay="flat"
            eyebrow="Concierge Service"
            heading="We're Here to Help"
            subtitle="Experience personalized assistance tailored to your needs. From order inquiries to bespoke styling, our experts are at your disposal."
            primaryAction={{ label: 'Contact Support', onClick: scrollToForm }}
        />
    );
}

export default ContactHeroSection;