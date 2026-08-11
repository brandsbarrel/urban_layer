import { Link } from 'react-router-dom';
import { MdSchedule } from 'react-icons/md';
import styles from './ArticleCard.module.css';

function ArticleCard({ slug, badge, image, title, excerpt, date, readTime }) {
    return (
        <Link to={`/journal/${slug}`} className={styles.card}>
            <div className={styles.imageWrapper}>
                <img src={image} alt={title} className={styles.image} />
                <span className={styles.badge}>{badge}</span>
            </div>
            <h3 className={styles.title}>{title}</h3>
            <p className={styles.excerpt}>{excerpt}</p>
            <div className={styles.meta}>
                <span>{date}</span>
                <span className={styles.readTime}>
                    <MdSchedule size={14} /> {readTime}
                </span>
            </div>
        </Link>
    );
}

export default ArticleCard;