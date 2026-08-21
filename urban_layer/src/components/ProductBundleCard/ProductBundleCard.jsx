import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { FaCheck } from 'react-icons/fa';
import { addToCartAsync } from '../../redux/slices/cartSlice';
import styles from './ProductBundleCard.module.css';

function ProductBundleCard({
    id,
    image,
    imageAlt,
    eyebrow,
    title,
    description,
    price,
    originalPrice,
    discountLabel,
    ctaLabel = 'Add Bundle to Cart',
}) {
    const dispatch = useDispatch();
    const [added, setAdded] = useState(false);

    const handleAddBundle = () => {
        const itemId = id || 'kit-bundle';
        dispatch(
            addToCartAsync({
                productId: itemId,
                id: itemId,
                name: title || 'Complete Kit Bundle',
                subtitle: 'Includes Case + Guard + Accessories',
                price: Number(price || 4999),
                originalPrice: originalPrice ? Number(originalPrice) : null,
                quantity: 1,
                image: image || '',
            })
        );
        setAdded(true);
        setTimeout(() => setAdded(false), 3000);
    };

    if (!title) return null;

    return (
        <div className={styles.card}>
            <div className={styles.imageWrapper}>
                <img src={image} alt={imageAlt || title} className={styles.image} />
            </div>
            <div className={styles.content}>
                {eyebrow && <span className={styles.eyebrow}>{eyebrow}</span>}
                <h2 className={styles.title}>{title}</h2>
                {description && <p className={styles.description}>{description}</p>}
                <div className={styles.priceRow}>
                    <div className={styles.priceBlock}>
                        <span className={styles.price}>₹{Number(price).toLocaleString('en-IN')}</span>
                        {originalPrice && (
                            <span className={styles.originalPrice}>
                                ₹{Number(originalPrice).toLocaleString('en-IN')}
                            </span>
                        )}
                    </div>
                    {discountLabel && <span className={styles.discountBadge}>{discountLabel}</span>}
                </div>
                <button type="button" onClick={handleAddBundle} className={styles.ctaButton}>
                    {added ? (
                        <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                            <FaCheck size={16} /> Bundle Added to Cart!
                        </span>
                    ) : (
                        ctaLabel
                    )}
                </button>
            </div>
        </div>
    );
}

export default ProductBundleCard;