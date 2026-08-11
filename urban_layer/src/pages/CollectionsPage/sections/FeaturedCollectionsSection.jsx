import CategoryCollectionCard from '../../../components/CategoryCollectionCard/CategoryCollectionCard';
import { featuredCollections } from '../../../services/collectionsPageData';
import styles from './FeaturedCollectionsSection.module.css';

function FeaturedCollectionsSection() {
    return (
        <section id="featured-collections" className={styles.section}>
            <div className={styles.grid}>
                {featuredCollections.map((collection) => (
                    <CategoryCollectionCard
                        key={collection.id}
                        image={collection.image}
                        imageAlt={collection.title}
                        categoryLabel={collection.categoryLabel}
                        title={collection.title}
                        productCount={collection.productCount}
                    />
                ))}
            </div>
        </section>
    );
}

export default FeaturedCollectionsSection;