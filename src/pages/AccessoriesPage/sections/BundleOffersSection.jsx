import BundleCard from '../../../components/BundleCard/BundleCard';
import { bundleOffers } from '../../../services/accessoriesPageData';
import styles from './BundleOffersSection.module.css';

function BundleOffersSection() {
    return (
        <section className={styles.section}>
            <h2 className={styles.heading}>The Luxury Bundles</h2>
            <div className={styles.grid}>
                {bundleOffers.map((bundle) => (
                    <BundleCard key={bundle.id} {...bundle} />
                ))}
            </div>
        </section>
    );
}

export default BundleOffersSection;