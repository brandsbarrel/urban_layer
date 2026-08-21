import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import Breadcrumb from '../../components/Breadcrumb/Breadcrumb';
import LifestyleImageBanner from '../../components/LifestyleImageBanner/LifestyleImageBanner';
import ProductOverviewSection from './sections/ProductOverviewSection';
import EngineeringFeaturesSection from './sections/EngineeringFeaturesSection';
import ProductHighlightsSection from './sections/ProductHighlightsSection';
import BundleSection from './sections/BundleSection';
import ProductReviewsSection from './sections/ProductReviewsSection';
import RecommendationsSlider from '../ShopPage/sections/RecommendationsSlider';
import { fetchProductDetailsAsync } from '../../services/productDetailsService';
import styles from './ProductDetailsPage.module.css';

function ProductDetailsPage() {
    const { productId } = useParams();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let isMounted = true;
        setLoading(true);

        window.scrollTo({ top: 0, behavior: 'smooth' });

        const loadDetails = async () => {
            try {
                const data = await fetchProductDetailsAsync(productId);
                if (isMounted) {
                    setProduct(data);
                    setLoading(false);
                }
            } catch {
                if (isMounted) {
                    setProduct(null);
                    setLoading(false);
                }
            }
        };

        loadDetails();

        return () => {
            isMounted = false;
        };
    }, [productId]);

    if (loading) {
        return (
            <div className={styles.page} style={{ padding: '80px 20px', textAlign: 'center' }}>
                <div style={{
                    width: '40px',
                    height: '40px',
                    margin: '0 auto 16px',
                    border: '3px solid #eee',
                    borderTopColor: '#111',
                    borderRadius: '50%',
                    animation: 'spin 0.8s linear infinite'
                }} />
                <p style={{ color: '#666', fontWeight: 500 }}>Loading product details...</p>
                <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
            </div>
        );
    }

    if (!product) {
        return (
            <div className={styles.notFound}>
                <h1>Product not found</h1>
                <p>We couldn't find the product you're looking for.</p>
                <Link to="/shop" className={styles.notFoundLink}>
                    Back to Shop
                </Link>
            </div>
        );
    }

    return (
        <div className={styles.page}>
            <Breadcrumb items={product.breadcrumb || [{ label: 'Home', path: '/' }, { label: 'Shop', path: '/shop' }, { label: product.name }]} />
            <ProductOverviewSection product={product} />

            {product.bentoFeatures && product.bentoFeatures.length > 0 && (
                <EngineeringFeaturesSection features={product.bentoFeatures} />
            )}

            {product.editorialHighlights && product.editorialHighlights.length > 0 && (
                <ProductHighlightsSection highlights={product.editorialHighlights} />
            )}

            {product.lifestyleBanner && (
                <LifestyleImageBanner {...product.lifestyleBanner} />
            )}

            {product.bundle && (
                <BundleSection bundle={product.bundle} />
            )}

            {product.reviews && product.reviews.length > 0 && (
                <ProductReviewsSection reviews={product.reviews} />
            )}

            <RecommendationsSlider />
        </div>
    );
}

export default ProductDetailsPage;