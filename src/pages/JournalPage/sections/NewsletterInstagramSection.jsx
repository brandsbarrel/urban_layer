import NewsletterSignup from '../../../components/NewsletterSignup/NewsletterSignup';
import JournalInstagramGrid from '../../../components/JournalInstagramGrid/JournalInstagramGrid';
import { journalInstagramImages } from '../../../services/journalPageData';
import styles from './NewsletterInstagramSection.module.css';

function NewsletterInstagramSection() {
    return (
        <section className={styles.section}>
            <div className={styles.grid}>
                <NewsletterSignup
                    variant="editorial"
                    editorialHeading="Stay ahead of the curve."
                    editorialSubtitle="Join 50,000+ subscribers and receive our weekly digest on design, engineering, and lifestyle directly in your inbox."
                    editorialCtaLabel="Join"
                />
                <JournalInstagramGrid images={journalInstagramImages} handle="@urbanlayers" />
            </div>
        </section>
    );
}

export default NewsletterInstagramSection;