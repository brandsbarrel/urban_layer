import ProductBundleCard from '../../../components/ProductBundleCard/ProductBundleCard';
import styles from './BundleSection.module.css';

function BundleSection({ bundle }) {
    return (
        <section className={styles.section}>
            <ProductBundleCard {...bundle} />
        </section>
    );
}

export default BundleSection;