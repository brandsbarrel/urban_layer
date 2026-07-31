import { useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { FaStar } from 'react-icons/fa';
import { MdShoppingBag, MdVisibility, MdShoppingCart } from 'react-icons/md';
import { addToCart } from '../../redux/slices/cartSlice';
import styles from './ProductCard.module.css';

function ProductCard({ product, variant = 'compact', onQuickView, badgePosition = 'left' }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const productPath = `/product/${product.id}`;

  const handleAddToCart = () => {
    dispatch(
      addToCart({ id: product.id, name: product.name, price: product.price, image: product.image })
    );
  };

  const handleQuickView = () => {
    if (onQuickView) {
      onQuickView(product);
    } else {
      navigate(productPath);
    }
  };

  if (variant === 'iconOverlay') {
    return (
      <div className={styles.cardIconOverlay}>
        <div className={styles.imageWrapperIconOverlay}>
          {product.badge && (
            <span
              className={
                badgePosition === 'right' ? styles.badgeRightPosition : styles.badgeLeftPosition
              }
            >
              {product.badge}
            </span>
          )}
          <Link to={productPath}>
            <img src={product.image} alt={product.name} className={styles.image} />
          </Link>
          <div className={styles.iconOverlayActions}>
            <button
              className={styles.iconActionButton}
              onClick={handleAddToCart}
              aria-label="Add to cart"
            >
              <MdShoppingCart size={20} />
            </button>
            <button
              className={styles.iconActionButton}
              onClick={handleQuickView}
              aria-label="Quick view"
            >
              <MdVisibility size={20} />
            </button>
          </div>
        </div>
        <div className={styles.infoIconOverlay}>
          <div className={styles.titleRowIconOverlay}>
            <Link to={productPath} className={styles.nameIconOverlay}>
              {product.name}
            </Link>
            <span className={styles.priceIconOverlay}>
              ₹{product.price.toLocaleString('en-IN')}
            </span>
          </div>
          <p className={styles.compatibility}>{product.compatibility}</p>
          {product.rating && (
            <div className={styles.ratingRowIconOverlay}>
              {Array.from({ length: 5 }).map((_, i) => (
                <FaStar
                  key={i}
                  size={13}
                  className={i < Math.round(product.rating) ? styles.starFilled : styles.starEmpty}
                />
              ))}
              {product.reviewCount != null && (
                <span className={styles.reviewCount}>({product.reviewCount})</span>
              )}
            </div>
          )}
        </div>
      </div>
    );
  }

  if (variant === 'reveal') {
    return (
      <div className={styles.cardReveal}>
        <Link to={productPath} className={styles.imageWrapperReveal}>
          {product.badge && (
            <span className={product.badge === 'NEW' ? styles.badgeDark : styles.badgeGold}>
              {product.badge}
            </span>
          )}
          <img src={product.image} alt={product.name} className={styles.image} />
        </Link>
        <button className={styles.revealAddButton} onClick={handleAddToCart}>
          ADD TO CART
        </button>
        <div className={styles.infoDetailed}>
          <div className={styles.titleRowDetailed}>
            <Link to={productPath} className={styles.nameReveal}>
              {product.name}
            </Link>
            {product.rating && (
              <span className={styles.rating}>
                <FaStar size={14} />
                {product.rating.toFixed(1)}
              </span>
            )}
          </div>
          <p className={styles.compatibility}>{product.compatibility}</p>
          <div className={styles.priceRowDetailed}>
            <span className={styles.price}>₹{product.price.toLocaleString('en-IN')}</span>
            {product.originalPrice && (
              <span className={styles.originalPrice}>
                ₹{product.originalPrice.toLocaleString('en-IN')}
              </span>
            )}
          </div>
        </div>
      </div>
    );
  }

  const isDetailed = variant === 'detailed';

  return (
    <div className={isDetailed ? styles.cardDetailed : styles.card}>
      <div className={isDetailed ? styles.imageWrapperDetailed : styles.imageWrapper}>
        {product.badge && (
          <span
            className={product.badge === 'Limited Edition' ? styles.badgeDark : styles.badgeGold}
          >
            {product.badge}
          </span>
        )}
        <Link to={productPath}>
          <img src={product.image} alt={product.name} className={styles.image} />
        </Link>

        {isDetailed ? (
          <div className={styles.overlayDetailed}>
            <button className={styles.addToCartButton} onClick={handleAddToCart}>
              <MdShoppingBag size={18} />
              <span>Add to Cart</span>
            </button>
            <button className={styles.quickViewButton} onClick={handleQuickView} aria-label="Quick view">
              <MdVisibility size={20} />
            </button>
          </div>
        ) : (
          <div className={styles.overlay}>
            <button className={styles.quickAddButton} onClick={handleAddToCart}>
              Quick Add
            </button>
          </div>
        )}
      </div>

      <div className={isDetailed ? styles.infoDetailed : styles.info}>
        <div className={isDetailed ? styles.titleRowDetailed : styles.titleRow}>
          <Link to={productPath} className={styles.name}>
            {product.name}
          </Link>
          {isDetailed && product.rating && (
            <span className={styles.rating}>
              <FaStar size={14} />
              {product.rating.toFixed(1)}
            </span>
          )}
        </div>
        <p className={styles.compatibility}>{product.compatibility}</p>
        <div className={isDetailed ? styles.priceRowDetailed : styles.priceRow}>
          <span className={styles.price}>₹{product.price.toLocaleString('en-IN')}</span>
          {isDetailed && product.originalPrice && (
            <span className={styles.originalPrice}>
              ₹{product.originalPrice.toLocaleString('en-IN')}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

export default ProductCard;