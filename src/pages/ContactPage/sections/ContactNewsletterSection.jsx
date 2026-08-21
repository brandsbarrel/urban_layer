import NewsletterSignup from '../../../components/NewsletterSignup/NewsletterSignup';
import styles from './ContactNewsletterSection.module.css';

function ContactNewsletterSection() {
    return (
        <section className={styles.section}>
            <NewsletterSignup
                variant="dark"
                darkHeading="Stay Informed"
                darkSubtitle="Subscribe to our newsletter for early access to new collections and exclusive event invitations."
                darkLayout="split"
            />
        </section>
    );
}

export default ContactNewsletterSection;