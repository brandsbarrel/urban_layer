import IconSearchInput from '../../../components/IconSearchInput/IconSearchInput';
import SearchChipList from '../../../components/SearchChipList/SearchChipList';
import { popularSearches } from '../../../services/faqPageData';
import styles from './FAQHeroSection.module.css';

function FAQHeroSection({ searchTerm, onSearchChange, onChipClick }) {
    return (
        <section className={styles.section}>
            <h1 className={styles.heading}>How Can We Help You?</h1>
            <p className={styles.subtitle}>
                Find answers to your questions about orders, products, shipping, and more.
            </p>
            <IconSearchInput
                value={searchTerm}
                onChange={onSearchChange}
                placeholder="Search for questions..."
            />
            <SearchChipList label="Popular:" chips={popularSearches} onChipClick={onChipClick} />
        </section>
    );
}

export default FAQHeroSection;