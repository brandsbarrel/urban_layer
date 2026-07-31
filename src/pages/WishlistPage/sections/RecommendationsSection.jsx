import RecommendationCard from '../../../components/RecommendationCard/RecommendationCard';
import { wishlistRecommendations } from '../../../services/wishlistPageData';
import styles from './RecommendationsSection.module.css';

function RecommendationsSection() {
    return (
        <section className={styles.section}>
            <h2 className={styles.heading}>You May Also Like</h2>
            <div className={styles.scrollRow}>
                {wishlistRecommendations.map((product) => (
                    <RecommendationCard key={product.id} product={product} />
                ))}
            </div>
        </section>
    );
}

export default RecommendationsSection;