import { useDispatch } from 'react-redux';
import { addToCart } from '../../redux/slices/cartSlice';
import styles from './ProductBundleCard.module.css';

function ProductBundleCard({ id, image, imageAlt, eyebrow, title, description, price, originalPrice, discountLabel, ctaLabel }) {
    const dispatch = useDispatch();

    const handleAddBundle = () => {
        dispatch(addToCart({ id, name: title, price, image }));
    };

    return (
        <div className={styles.card}>
            <div className={styles.imageWrapper}>
                <img src={image} alt={imageAlt} className={styles.image} />
            </div>
            <div className={styles.content}>
                <span className={styles.eyebrow}>{eyebrow}</span>
                <h2 className={styles.title}>{title}</h2>
                <p className={styles.description}>{description}</p>
                <div className={styles.priceRow}>
                    <div className={styles.priceBlock}>
                        <span className={styles.price}>₹{price.toLocaleString('en-IN')}</span>
                        {originalPrice && (
                            <span className={styles.originalPrice}>
                                ₹{originalPrice.toLocaleString('en-IN')}
                            </span>
                        )}
                    </div>
                    {discountLabel && <span className={styles.discountBadge}>{discountLabel}</span>}
                </div>
                <button type="button" onClick={handleAddBundle} className={styles.ctaButton}>
                    {ctaLabel}
                </button>
            </div>
        </div>
    );
}

export default ProductBundleCard;