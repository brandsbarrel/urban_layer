import { Link } from 'react-router-dom';
import { MdArrowForward } from 'react-icons/md';
import BundleCard from '../../../components/BundleCard/BundleCard';
import { searchBundles } from '../../../services/searchResultsData';
import styles from './BundleSuggestionsSection.module.css';

function BundleSuggestionsSection() {
    return (
        <section className={styles.section}>
            <div className={styles.container}>
                <div className={styles.header}>
                    <div>
                        <h2 className={styles.heading}>Complete Your Setup</h2>
                        <p className={styles.subtitle}>Exclusive bundles designed for the iPhone 16 series.</p>
                    </div>
                    <Link to="/shop" className={styles.viewAllLink}>
                        View All Bundles <MdArrowForward size={16} />
                    </Link>
                </div>
                <div className={styles.grid}>
                    {searchBundles.map((bundle) => (
                        <BundleCard key={bundle.id} {...bundle} compact />
                    ))}
                </div>
            </div>
        </section>
    );
}

export default BundleSuggestionsSection;