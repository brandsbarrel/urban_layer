import CollectionMasonryCard from '../../../components/CollectionMasonryCard/CollectionMasonryCard';
import { masonryItems } from '../../../services/collectionsPageData';
import styles from './CuratedJourneysSection.module.css';

function CuratedJourneysSection() {
    return (
        <section className={styles.section}>
            <h2 className={styles.heading}>Curated Journeys</h2>
            <div className={styles.masonry}>
                {masonryItems.map((item) => (
                    <CollectionMasonryCard
                        key={item.id}
                        image={item.image}
                        imageAlt={item.title}
                        title={item.title}
                        itemCount={item.itemCount}
                        priceFrom={item.priceFrom}
                    />
                ))}
            </div>
        </section>
    );
}

export default CuratedJourneysSection;