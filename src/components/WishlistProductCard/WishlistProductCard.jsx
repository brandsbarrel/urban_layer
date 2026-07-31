import { FaStar, FaStarHalfAlt, FaRegStar } from 'react-icons/fa';
import { MdFavorite } from 'react-icons/md';
import styles from './WishlistProductCard.module.css';

function StarRow({ rating }) {
    const fullStars = Math.floor(rating);
    const hasHalf = rating - fullStars >= 0.5;
    return (
        <div className={styles.starRow}>
            {Array.from({ length: 5 }).map((_, i) => {
                if (i < fullStars) return <FaStar key={i} size={13} />;
                if (i === fullStars && hasHalf) return <FaStarHalfAlt key={i} size={13} />;
                return <FaRegStar key={i} size={13} className={styles.starEmpty} />;
            })}
        </div>
    );
}

function WishlistProductCard({ item, selected, onToggleSelect, onMoveToCart, onRemove }) {
    return (
        <div className={styles.card}>
            <div className={styles.imageWrapper}>
                <div className={styles.topLeftStack}>
                    <input
                        type="checkbox"
                        checked={selected}
                        onChange={() => onToggleSelect(item.id)}
                        className={styles.checkbox}
                        aria-label={`Select ${item.name}`}
                    />
                    {item.badge && <span className={styles.badge}>{item.badge}</span>}
                </div>

                <button
                    className={styles.heartButton}
                    onClick={() => onRemove(item.id)}
                    aria-label="Remove from wishlist"
                >
                    <MdFavorite size={20} />
                </button>

                <img src={item.image} alt={item.name} className={styles.image} />

                <div className={styles.hoverOverlay}>
                    <button className={styles.moveToCartButton} onClick={() => onMoveToCart(item)}>
                        Move to Cart
                    </button>
                    <button className={styles.quickRemoveButton} onClick={() => onRemove(item.id)}>
                        Quick Remove
                    </button>
                </div>
            </div>

            <div className={styles.info}>
                <div className={styles.titleRow}>
                    <h3 className={styles.name}>{item.name}</h3>
                    <div className={styles.priceBlock}>
                        <span className={styles.price}>₹{item.price.toLocaleString('en-IN')}</span>
                        {item.originalPrice && (
                            <span className={styles.originalPrice}>
                                ₹{item.originalPrice.toLocaleString('en-IN')}
                            </span>
                        )}
                    </div>
                </div>
                <p className={styles.subtitle}>{item.subtitle}</p>
                <div className={styles.ratingRow}>
                    <StarRow rating={item.rating} />
                    <span className={styles.reviewCount}>({item.reviewCount})</span>
                </div>
                <div className={styles.stockRow}>
                    <span
                        className={
                            item.stockStatus === 'low-stock' ? styles.stockDotLow : styles.stockDotAvailable
                        }
                    />
                    <span
                        className={
                            item.stockStatus === 'low-stock' ? styles.stockLabelLow : styles.stockLabelAvailable
                        }
                    >
                        {item.stockLabel}
                    </span>
                </div>
            </div>
        </div>
    );
}

export default WishlistProductCard;