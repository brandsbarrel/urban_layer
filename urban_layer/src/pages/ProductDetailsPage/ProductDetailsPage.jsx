import { useParams, Link } from 'react-router-dom';
import Breadcrumb from '../../components/Breadcrumb/Breadcrumb';
import LifestyleImageBanner from '../../components/LifestyleImageBanner/LifestyleImageBanner';
import ProductOverviewSection from './sections/ProductOverviewSection';
import EngineeringFeaturesSection from './sections/EngineeringFeaturesSection';
import ProductHighlightsSection from './sections/ProductHighlightsSection';
import BundleSection from './sections/BundleSection';
import ProductReviewsSection from './sections/ProductReviewsSection';
import { getProductDetails } from '../../services/productDetailsService';
import styles from './ProductDetailsPage.module.css';

function ProductDetailsPage() {
    const { productId } = useParams();
    const product = getProductDetails(productId);

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
            <Breadcrumb items={product.breadcrumb} />
            <ProductOverviewSection product={product} />
            <EngineeringFeaturesSection features={product.bentoFeatures} />
            <ProductHighlightsSection highlights={product.editorialHighlights} />
            <LifestyleImageBanner {...product.lifestyleBanner} />
            <BundleSection bundle={product.bundle} />
            <ProductReviewsSection reviews={product.reviews} />
        </div>
    );
}

export default ProductDetailsPage;