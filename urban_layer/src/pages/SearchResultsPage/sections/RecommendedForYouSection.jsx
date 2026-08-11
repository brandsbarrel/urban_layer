import RecommendationCard from '../../../components/RecommendationCard/RecommendationCard';
import { recommendedSearchProducts } from '../../../services/searchResultsData';
import styles from './RecommendedForYouSection.module.css';

function RecommendedForYouSection() {
    return (
        <section className={styles.section}>
            <div className={styles.container}>
                <h2 className={styles.heading}>Recommended For You</h2>
                <div className={styles.scrollRow}>
                    {recommendedSearchProducts.map((product) => (
                        <RecommendationCard key={product.id} product={product} />
                    ))}
                </div>
            </div>
        </section>
    );
}

export default RecommendedForYouSection;