import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { FaHeart, FaRegHeart, FaCheck, FaShieldAlt } from 'react-icons/fa';
import { MdShoppingBag, MdFlashOn, MdLocalOffer, MdCategory, MdPhoneIphone, MdInventory, MdSpeed, MdScale, MdAspectRatio } from 'react-icons/md';

import ProductGallery from '../../../components/ProductGallery/ProductGallery';
import OptionButtonGroup from '../../../components/OptionButtonGroup/OptionButtonGroup';
import ColorSwatchFilter from '../../../components/ColorSwatchFilter/ColorSwatchFilter';
import QuantityStepper from '../../../components/QuantityStepper/QuantityStepper';

import { addToCartAsync } from '../../../redux/slices/cartSlice';
import { addItem as addToWishlist, removeItem as removeFromWishlist, selectWishlistItems } from '../../../redux/slices/wishlistSlice';

import styles from './ProductOverviewSection.module.css';

function ProductOverviewSection({ product }) {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const wishlistItems = useSelector(selectWishlistItems);
    const isWishlisted = wishlistItems.some((item) => item.id === product.id || item.id === `${product.id}-wl`);

    const models = Array.isArray(product.models) ? product.models : [];
    const colors = Array.isArray(product.colors) ? product.colors : [];

    const [selectedModel, setSelectedModel] = useState(models[0]?.id || '');
    const [selectedColor, setSelectedColor] = useState(colors[0]?.id || '');
    const [quantity, setQuantity] = useState(1);
    const [toastMessage, setToastMessage] = useState('');

    const selectedModelObj = models.find((m) => m.id === selectedModel);
    const selectedColorObj = colors.find((c) => c.id === selectedColor);

    const showToast = (msg) => {
        setToastMessage(msg);
        setTimeout(() => setToastMessage(''), 3000);
    };

    const handleAddToCart = () => {
        const id = product.id || product._id;
        const modelLabel = selectedModelObj?.label || product.phoneModel?.name || '';
        const colorLabel = selectedColorObj?.label || '';
        const subtitleParts = [modelLabel, colorLabel].filter(Boolean);

        dispatch(
            addToCartAsync({
                productId: id,
                id: `${id}${selectedModel ? '-' + selectedModel : ''}${selectedColor ? '-' + selectedColor : ''}`,
                name: product.name,
                subtitle: subtitleParts.join(' • ') || product.sku || 'Standard',
                price: Number(product.price),
                originalPrice: product.originalPrice ? Number(product.originalPrice) : null,
                quantity: quantity,
                image: product.heroImage || product.featuredImage || '',
            })
        );
        showToast(`Added ${quantity} x ${product.name} to Cart!`);
    };

    const handleBuyNow = () => {
        handleAddToCart();
        navigate('/checkout');
    };

    const handleToggleWishlist = () => {
        if (isWishlisted) {
            dispatch(removeFromWishlist(product.id));
            dispatch(removeFromWishlist(`${product.id}-wl`));
            showToast('Removed from Wishlist');
        } else {
            const modelLabel = selectedModelObj?.label || product.phoneModel?.name || '';
            const colorLabel = selectedColorObj?.label || '';
            const subtitleParts = [modelLabel, colorLabel].filter(Boolean);

            dispatch(
                addToWishlist({
                    id: product.id,
                    name: product.name,
                    subtitle: subtitleParts.join(' • ') || product.sku || '',
                    price: Number(product.price),
                    originalPrice: product.originalPrice ? Number(product.originalPrice) : null,
                    badge: product.collection || 'In Stock',
                    rating: 5,
                    reviewCount: 1,
                    stockStatus: product.inStock ? 'in-stock' : 'out-of-stock',
                    stockLabel: product.inStock ? 'In Stock' : 'Out of Stock',
                    image: product.heroImage || product.featuredImage || '',
                })
            );
            showToast('Added to Wishlist!');
        }
    };

    const discountPercentage = product.originalPrice && product.originalPrice > product.price
        ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
        : null;

    const phoneModelName = product.phoneModel
        ? `${product.phoneModel.brand ? product.phoneModel.brand + ' ' : ''}${product.phoneModel.name}`
        : null;

    return (
        <section className={styles.section}>
            {toastMessage && (
                <div className={styles.toast}>
                    <FaCheck size={16} />
                    <span>{toastMessage}</span>
                </div>
            )}

            <div className={styles.galleryColumn}>
                <ProductGallery
                    heroImage={product.heroImage || product.featuredImage}
                    thumbnails={product.thumbnails || []}
                    badge={product.collection}
                    productName={product.name}
                />
            </div>

            <div className={styles.infoColumn}>
                <div className={styles.headerBlock}>
                    <div className={styles.stockBadgeRow}>
                        <span className={product.inStock ? styles.stockDot : styles.stockDotOut}></span>
                        <span className={product.inStock ? styles.stockText : styles.stockTextOut}>
                            {product.inStock
                                ? `In Stock (${product.stock} unit${product.stock > 1 ? 's' : ''} available)`
                                : 'Out of Stock'}
                        </span>
                    </div>

                    <h1 className={styles.title}>{product.name}</h1>

                    {phoneModelName && (
                        <p className={styles.compatibilityLine}>
                            <MdPhoneIphone size={16} />
                            <span>Compatible with <strong>{phoneModelName}</strong></span>
                        </p>
                    )}

                    {product.categories && product.categories.length > 0 && (
                        <div className={styles.categoryBadgeRow}>
                            <MdCategory size={14} className={styles.categoryIcon} />
                            {product.categories.map((cat) => (
                                <Link
                                    key={cat.id || cat.slug}
                                    to={`/shop?category=${cat.slug || cat.id}`}
                                    className={styles.categoryTag}
                                >
                                    {cat.name}
                                </Link>
                            ))}
                        </div>
                    )}
                </div>

                <div className={styles.priceRow}>
                    <span className={styles.price}>₹{Number(product.price).toLocaleString('en-IN')}</span>
                    {product.originalPrice && (
                        <span className={styles.originalPrice}>
                            ₹{Number(product.originalPrice).toLocaleString('en-IN')}
                        </span>
                    )}
                    {discountPercentage != null && discountPercentage > 0 && (
                        <span className={styles.discountBadge}>{discountPercentage}% OFF</span>
                    )}
                </div>

                {product.description && (
                    <div className={styles.descriptionBox}>
                        <div
                            className={styles.descriptionText}
                            dangerouslySetInnerHTML={{ __html: product.description }}
                        />
                    </div>
                )}

                <div className={styles.optionsBlock}>
                    {models.length > 0 && (
                        <OptionButtonGroup
                            label="Select Device Model"
                            options={models}
                            selectedId={selectedModel}
                            onSelect={setSelectedModel}
                        />
                    )}

                    {colors.length > 0 && (
                        <ColorSwatchFilter
                            title="Choose Color"
                            colors={colors}
                            selectedId={selectedColor}
                            onSelect={setSelectedColor}
                            size="lg"
                            mode="select"
                            showSelectedLabel
                        />
                    )}

                    <div className={styles.quantitySection}>
                        <label className={styles.quantityLabel}>Quantity</label>
                        <QuantityStepper
                            quantity={quantity}
                            onIncrement={() => setQuantity((q) => q + 1)}
                            onDecrement={() => setQuantity((q) => Math.max(1, q - 1))}
                        />
                    </div>
                </div>

                <div className={styles.actions}>
                    <button
                        type="button"
                        onClick={handleAddToCart}
                        className={styles.addToCartButton}
                        disabled={!product.inStock}
                    >
                        <MdShoppingBag size={20} />
                        <span>{product.inStock ? 'Add to Cart' : 'Out of Stock'}</span>
                    </button>

                    <button
                        type="button"
                        onClick={handleBuyNow}
                        className={styles.buyNowButton}
                        disabled={!product.inStock}
                    >
                        <MdFlashOn size={20} />
                        <span>Buy It Now</span>
                    </button>

                    <button
                        type="button"
                        onClick={handleToggleWishlist}
                        className={isWishlisted ? `${styles.wishlistButton} ${styles.wishlisted}` : styles.wishlistButton}
                        aria-label="Wishlist"
                    >
                        {isWishlisted ? <FaHeart size={18} color="#e53e3e" /> : <FaRegHeart size={18} />}
                    </button>
                </div>

                <div className={styles.guaranteeBox}>
                    <FaShieldAlt size={18} color="#c5a059" />
                    <span>Free Express Shipping across India • 100% Genuine Product</span>
                </div>

                {/* Dynamic Product Specifications Card */}
                <div className={styles.specsCard}>
                    <h3 className={styles.specsTitle}>Product Specifications</h3>
                    <div className={styles.specsGrid}>
                        {product.sku && (
                            <div className={styles.specItem}>
                                <span className={styles.specLabel}>SKU / Code</span>
                                <span className={styles.specValue}>{product.sku}</span>
                            </div>
                        )}
                        {phoneModelName && (
                            <div className={styles.specItem}>
                                <span className={styles.specLabel}>Compatible Device</span>
                                <span className={styles.specValue}>{phoneModelName}</span>
                            </div>
                        )}
                        {product.collection && (
                            <div className={styles.specItem}>
                                <span className={styles.specLabel}>Collection</span>
                                <span className={styles.specValue}>{product.collection}</span>
                            </div>
                        )}
                        {product.weight != null && (
                            <div className={styles.specItem}>
                                <span className={styles.specLabel}>Weight</span>
                                <span className={styles.specValue}>{product.weight} g</span>
                            </div>
                        )}
                        {product.dimensions && (product.dimensions.length || product.dimensions.width) && (
                            <div className={styles.specItem}>
                                <span className={styles.specLabel}>Dimensions</span>
                                <span className={styles.specValue}>
                                    {product.dimensions.length || 0} × {product.dimensions.width || 0} × {product.dimensions.height || 0} cm
                                </span>
                            </div>
                        )}
                        {product.packageType && (
                            <div className={styles.specItem}>
                                <span className={styles.specLabel}>Packaging</span>
                                <span className={styles.specValue}>{product.packageType}</span>
                            </div>
                        )}
                        {product.shippingClass && (
                            <div className={styles.specItem}>
                                <span className={styles.specLabel}>Shipping Class</span>
                                <span className={styles.specValue}>{product.shippingClass}</span>
                            </div>
                        )}
                        <div className={styles.specItem}>
                            <span className={styles.specLabel}>Fragile Handling</span>
                            <span className={styles.specValue}>{product.fragile ? 'Yes' : 'No'}</span>
                        </div>
                    </div>

                    {product.tags && product.tags.length > 0 && (
                        <div className={styles.tagsRow}>
                            <MdLocalOffer size={14} className={styles.tagIcon} />
                            {product.tags.map((tag, idx) => (
                                <span key={idx} className={styles.tagChip}>
                                    #{tag}
                                </span>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
}

export default ProductOverviewSection;