import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { FaStar, FaRegStar, FaStarHalfAlt } from 'react-icons/fa';
import { MdVerifiedUser, MdBolt, MdEco } from 'react-icons/md';
import ProductGallery from '../../../components/ProductGallery/ProductGallery';
import OptionButtonGroup from '../../../components/OptionButtonGroup/OptionButtonGroup';
import ColorSwatchFilter from '../../../components/ColorSwatchFilter/ColorSwatchFilter';
import FeatureListItem from '../../../components/FeatureListItem/FeatureListItem';
import { addToCart } from '../../../redux/slices/cartSlice';
import styles from './ProductOverviewSection.module.css';

const FEATURE_ICON_MAP = {
    verified_user: MdVerifiedUser,
    bolt: MdBolt,
    eco: MdEco,
};

function StarDisplay({ rating }) {
    const fullStars = Math.floor(rating);
    const hasHalf = rating - fullStars >= 0.5;
    return (
        <div className={styles.starRow}>
            {Array.from({ length: 5 }).map((_, i) => {
                if (i < fullStars) return <FaStar key={i} />;
                if (i === fullStars && hasHalf) return <FaStarHalfAlt key={i} />;
                return <FaRegStar key={i} />;
            })}
        </div>
    );
}

function ProductOverviewSection({ product }) {
    const dispatch = useDispatch();
    const [selectedModel, setSelectedModel] = useState(product.models[0].id);
    const [selectedColor, setSelectedColor] = useState(product.colors[0].id);

    const handleAddToCart = () => {
        dispatch(
            addToCart({
                id: `${product.id}-${selectedModel}-${selectedColor}`,
                name: `${product.name} (${selectedColor})`,
                price: product.price,
                image: product.heroImage,
            })
        );
    };

    const handleBuyNow = () => {
        handleAddToCart();
    };

    return (
        <section className={styles.section}>
            <div className={styles.galleryColumn}>
                <ProductGallery
                    heroImage={product.heroImage}
                    thumbnails={product.thumbnails}
                    badge={product.badge}
                    productName={product.name}
                />
            </div>

            <div className={styles.infoColumn}>
                <div className={styles.headerBlock}>
                    <h1 className={styles.title}>{product.name}</h1>
                    <p className={styles.tagline}>{product.tagline}</p>
                    <div className={styles.ratingRow}>
                        <StarDisplay rating={product.rating} />
                        <span className={styles.ratingText}>
                            {product.rating} ({product.reviewCount} Reviews)
                        </span>
                    </div>
                </div>

                <div className={styles.price}>₹{product.price.toLocaleString('en-IN')}</div>

                <div className={styles.optionsBlock}>
                    <OptionButtonGroup
                        label="Select Model"
                        options={product.models}
                        selectedId={selectedModel}
                        onSelect={setSelectedModel}
                    />
                    <ColorSwatchFilter
                        title="Color"
                        colors={product.colors}
                        selectedId={selectedColor}
                        onSelect={setSelectedColor}
                        size="lg"
                        mode="select"
                        showSelectedLabel
                    />
                </div>

                <div className={styles.actions}>
                    <button type="button" onClick={handleAddToCart} className={styles.addToCartButton}>
                        Add to Cart
                    </button>
                    <button type="button" onClick={handleBuyNow} className={styles.buyNowButton}>
                        Buy It Now
                    </button>
                </div>

                <div className={styles.featureList}>
                    {product.featureList.map((feature) => (
                        <FeatureListItem
                            key={feature.label}
                            icon={FEATURE_ICON_MAP[feature.icon]}
                            label={feature.label}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
}

export default ProductOverviewSection;