import { useDispatch } from 'react-redux';
import { addToCart } from '../../redux/slices/cartSlice';
import styles from './BundleCard.module.css';

function BundleCard({
    id,
    image,
    imageAlt,
    badge,
    title,
    description,
    price,
    originalPrice,
    ctaLabel,
    path = '/shop',
    variant = 'light',
    compact = false,
}) {
    const isDark = variant === 'dark';
    const dispatch = useDispatch();

    const handleAddBundle = () => {
        dispatch(addToCart({ id: id || title, name: title, price, image }));
    };

    if (compact) {
        return (
            <div className={styles.cardCompact}>
                <div className={styles.imageWrapperCompact}>
                    <img src={image} alt={imageAlt} className={styles.image} />
                </div>
                <div className={styles.contentCompact}>
                    <span className={styles.badgeLight}>{badge}</span>
                    <h3 className={styles.titleCompact}>{title}</h3>
                    <p className={styles.description}>{description}</p>
                    <div className={styles.footerCompact}>
                        <span className={styles.priceRowCompact}>
                            ₹{price.toLocaleString('en-IN')}
                            {originalPrice && (
                                <span className={styles.originalPrice}>
                                    ₹{originalPrice.toLocaleString('en-IN')}
                                </span>
                            )}
                        </span>
                        <button type="button" onClick={handleAddBundle} className={styles.ctaCompact}>
                            {ctaLabel}
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className={isDark ? styles.cardDark : styles.cardLight}>
            <div className={styles.imageWrapper}>
                <img src={image} alt={imageAlt} className={styles.image} />
            </div>
            <div className={styles.content}>
                <span className={isDark ? styles.badgeDark : styles.badgeLight}>{badge}</span>
                <h3 className={styles.title}>{title}</h3>
                <p className={isDark ? styles.descriptionDark : styles.description}>{description}</p>
                <div className={styles.footer}>
                    <div className={styles.priceRow}>
                        <span className={isDark ? styles.priceDark : styles.price}>
                            ₹{price.toLocaleString('en-IN')}
                        </span>
                        {originalPrice && (
                            <span className={isDark ? styles.originalPriceDark : styles.originalPrice}>
                                ₹{originalPrice.toLocaleString('en-IN')}
                            </span>
                        )}
                    </div>
                    <button type="button" onClick={handleAddBundle} className={isDark ? styles.ctaDark : styles.ctaLight}>
                        {ctaLabel}
                    </button>
                </div>
            </div>
        </div>
    );
}

export default BundleCard;