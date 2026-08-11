import EditorialFeatureBlock from '../../../components/EditorialFeatureBlock/EditorialFeatureBlock';
import styles from './ProductHighlightsSection.module.css';

function ProductHighlightsSection({ highlights }) {
    return (
        <section className={styles.section}>
            {highlights.map((highlight) => (
                <EditorialFeatureBlock key={highlight.heading} {...highlight} />
            ))}
        </section>
    );
}

export default ProductHighlightsSection;