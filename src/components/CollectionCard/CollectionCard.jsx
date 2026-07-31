import { Link } from 'react-router-dom';
import { MdArrowForward } from 'react-icons/md';
import styles from './CollectionCard.module.css';

function CollectionCard({
    image,
    eyebrow,
    title,
    description,
    ctaLabel,
    path,
    ctaVariant = 'gold',
    overlay = 'gradient',
    ctaStyle = 'button',
    height = 'tall',
}) {
    return (
        <div
            className={height === 'compact' ? styles.cardCompact : styles.card}
            style={{ backgroundImage: `url('${image}')` }}
        >
            <div className={overlay === 'flat' ? styles.overlayFlat : styles.gradient} />
            <div className={styles.content}>
                {eyebrow && <span className={styles.eyebrow}>{eyebrow}</span>}
                <h4 className={styles.title}>{title}</h4>
                {description && <p className={styles.description}>{description}</p>}
                {ctaStyle === 'link-arrow' ? (
                    <Link to={path} className={styles.ctaArrow}>
                        {ctaLabel} <MdArrowForward size={18} className={styles.ctaArrowIcon} />
                    </Link>
                ) : (
                    <Link to={path} className={ctaVariant === 'gold' ? styles.ctaGold : styles.ctaLight}>
                        {ctaLabel}
                    </Link>
                )}
            </div>
        </div>
    );
}

export default CollectionCard;