import ArticleCard from '../../../components/ArticleCard/ArticleCard';
import styles from './ArticlesGridSection.module.css';

function ArticlesGridSection({ items }) {
    return (
        <section id="articles-grid" className={styles.section}>
            {items.length === 0 ? (
                <p className={styles.emptyState}>No stories match your search.</p>
            ) : (
                <div className={styles.grid}>
                    {items.map((article) => (
                        <ArticleCard key={article.slug} {...article} />
                    ))}
                </div>
            )}
        </section>
    );
}

export default ArticlesGridSection;