import { useParams, Link } from 'react-router-dom';
import { getJournalEntryBySlug } from '../../services/journalPageData';
import styles from './JournalArticleDetailPage.module.css';

function JournalArticleDetailPage() {
    const { slug } = useParams();
    const entry = getJournalEntryBySlug(slug);

    if (!entry) {
        return (
            <div className={styles.notFound}>
                <h1>Story Not Found</h1>
                <p>We couldn't find this journal entry.</p>
                <Link to="/journal" className={styles.notFoundLink}>
                    Back to Journal
                </Link>
            </div>
        );
    }

    return (
        <article className={styles.page}>
            <div className={styles.heroWrapper}>
                <img src={entry.image} alt={entry.title} className={styles.heroImage} />
            </div>
            <div className={styles.content}>
                <Link to="/journal" className={styles.backLink}>
                    ← Back to Journal
                </Link>
                {entry.badge && <span className={styles.badge}>{entry.badge}</span>}
                <h1 className={styles.title}>{entry.title}</h1>
                {entry.date && <p className={styles.meta}>{entry.date}</p>}
                <p className={styles.excerpt}>{entry.excerpt}</p>
                <div className={styles.comingSoon}>
                    <p>The full story is coming soon. Thanks for your patience while we finish writing it.</p>
                </div>
            </div>
        </article>
    );
}

export default JournalArticleDetailPage;