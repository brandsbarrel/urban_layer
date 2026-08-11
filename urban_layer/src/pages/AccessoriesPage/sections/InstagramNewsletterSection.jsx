import ImageGalleryGrid from '../../../components/ImageGalleryGrid/ImageGalleryGrid';
import NewsletterSignup from '../../../components/NewsletterSignup/NewsletterSignup';
import { accessoriesInstagramImages } from '../../../services/accessoriesPageData';
import styles from './InstagramNewsletterSection.module.css';

function InstagramNewsletterSection() {
    return (
        <section className={styles.section}>
            <div className={styles.header}>
                <h2 className={styles.heading}>#UrbanLayersStyle</h2>
                <p className={styles.subtitle}>Join 500k+ others on Instagram</p>
            </div>

            <ImageGalleryGrid
                images={accessoriesInstagramImages}
                mobileColumns={2}
                desktopColumns={4}
                largeColumns={6}
            />

            <div className={styles.newsletterWrapper}>
                <NewsletterSignup
                    variant="banner"
                    bannerHeading="Join the Membership"
                    bannerText="Be the first to know about new accessory drops and exclusive early-access events."
                />
            </div>
        </section>
    );
}

export default InstagramNewsletterSection;