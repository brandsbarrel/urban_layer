import BuyingGuideCard from '../../../components/BuyingGuideCard/BuyingGuideCard';
import { buyingGuides } from '../../../services/journalPageData';
import styles from './BuyingGuidesSection.module.css';

function BuyingGuidesSection() {
    return (
        <section className={styles.section}>
            {buyingGuides.map((guide) => (
                <BuyingGuideCard key={guide.slug} {...guide} />
            ))}
        </section>
    );
}

export default BuyingGuidesSection;