import ProductCard from '../../../components/ProductCard/ProductCard';
import { bestSellerProducts } from '../../../services/productsService';
import styles from './BestSellersSection.module.css';

function BestSellersSection() {
    return (
        <section className={styles.section}>
            <div className={styles.header}>
                <h3 className={styles.heading}>Our Best Sellers</h3>
                <p className={styles.subtitle}>
                    The accessories our community loves most, designed for those who refuse to
                    compromise.
                </p>
            </div>
            <div className={styles.grid}>
                {bestSellerProducts.map((product) => (
                    <ProductCard key={product.id} product={product} />
                ))}
            </div>
        </section>
    );
}

export default BestSellersSection;