// import CollectionCard from '../../../components/CollectionCard/CollectionCard';
// import { curatedCollections } from "../../../services/homePageData";
import styles from './CollectionsSection.module.css';

function CollectionsSection() {
    return (
        <section className={styles.section}>
            <div className={styles.container}>
                <h3 className={styles.heading}>Curated Collections</h3>
                {/* <div className={styles.grid}>
                    {curatedCollections.map((collection) => (
                        <CollectionCard key={collection.id} {...collection} />
                    ))}
                </div> */}
            </div>
        </section>
    );
}

export default CollectionsSection;