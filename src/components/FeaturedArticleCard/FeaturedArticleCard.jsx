import { Link } from 'react-router-dom';
import styles from './FeaturedArticleCard.module.css';

function FeaturedArticleCard({ slug, badge, image, title, excerpt, author, readTime }) {
    return (
        <Link to={`/journal/${slug}`} className={styles.card}>
            <div className={styles.imageWrapper}>
                <img src={image} alt={title} className={styles.image} />
            </div>
            <div className={styles.content}>
                <span className={styles.badge}>{badge}</span>
                <h2 className={styles.title}>{title}</h2>
                <p className={styles.excerpt}>{excerpt}</p>
                <div className={styles.footer}>
                    <div className={styles.authorRow}>
                        <div className={styles.avatar} />
                        <div>
                            <p className={styles.authorName}>{author.name}</p>
                            <p className={styles.authorRole}>{author.role}</p>
                        </div>
                    </div>
                    <span className={styles.readTime}>{readTime}</span>
                </div>
            </div>
        </Link>
    );
}

export default FeaturedArticleCard;