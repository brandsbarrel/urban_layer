import HeroSearchBar from '../../../components/HeroSearchBar/HeroSearchBar';
import SearchChipList from '../../../components/SearchChipList/SearchChipList';
import { recentSearches } from '../../../services/searchResultsData';
import styles from './SearchHeroSection.module.css';

function SearchHeroSection({ query, onQueryChange, onSearch }) {
    return (
        <section className={styles.section}>
            <div className={styles.container}>
                <h1 className={styles.heading}>Find Your Perfect Match</h1>
                <HeroSearchBar
                    value={query}
                    onChange={onQueryChange}
                    onSearch={onSearch}
                    placeholder="Search for products, collections, or phone models..."
                />
                <SearchChipList chips={recentSearches} onChipClick={onSearch} />
            </div>
        </section>
    );
}

export default SearchHeroSection;