import { Link } from 'react-router-dom';
import styles from './EditorPickItem.module.css';

function EditorPickItem({ slug, tag, image, title, excerpt }) {
    return (
        <Link to={`/journal/${slug}`} className={styles.item}>
            <div className={styles.imageWrapper}>
                <img src={image} alt={title} className={styles.image} />
            </div>
            <div className={styles.content}>
                <span className={styles.tag}>{tag}</span>
                <h4 className={styles.title}>{title}</h4>
                <p className={styles.excerpt}>{excerpt}</p>
            </div>
        </Link>
    );
}

export default EditorPickItem;