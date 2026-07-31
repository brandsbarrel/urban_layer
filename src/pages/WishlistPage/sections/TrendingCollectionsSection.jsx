import CollectionCard from '../../../components/CollectionCard/CollectionCard';
import { wishlistTrendingCollections } from '../../../services/wishlistPageData';
import styles from './TrendingCollectionsSection.module.css';

function TrendingCollectionsSection() {
    return (
        <section className={styles.section}>
            <h2 className={styles.heading}>Trending Collections</h2>
            <div className={styles.grid}>
                {wishlistTrendingCollections.map((collection) => (
                    <CollectionCard
                        key={collection.id}
                        image={collection.image}
                        eyebrow={collection.eyebrow}
                        title={collection.title}
                        ctaLabel={collection.ctaLabel}
                        path={collection.path}
                        overlay="flat"
                        ctaStyle="link-arrow"
                        height="compact"
                    />
                ))}
            </div>
        </section>
    );
}

export default TrendingCollectionsSection;