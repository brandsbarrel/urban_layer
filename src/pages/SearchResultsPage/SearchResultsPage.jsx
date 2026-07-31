import { useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import NewsletterSignup from '../../components/NewsletterSignup/NewsletterSignup';
import SearchHeroSection from './sections/SearchHeroSection';
import SearchFiltersSidebar from './sections/SearchFiltersSidebar';
import SearchResultsGrid from './sections/SearchResultsGrid';
import BundleSuggestionsSection from './sections/BundleSuggestionsSection';
import RecommendedForYouSection from './sections/RecommendedForYouSection';
import { searchProducts, searchPriceRange } from '../../services/searchResultsData';
import styles from './SearchResultsPage.module.css';

const PAGE_SIZE = 2;
const DEFAULT_FILTERS = {
    brands: [],
    materials: [],
    features: [],
    maxPrice: searchPriceRange.max,
};

function SearchResultsPage() {
    const [searchParams] = useSearchParams();
    const [queryInput, setQueryInput] = useState(searchParams.get('q') || '');
    const [activeQuery, setActiveQuery] = useState(searchParams.get('q') || '');
    const [filters, setFilters] = useState(DEFAULT_FILTERS);
    const [sortBy, setSortBy] = useState('newest');
    const [currentPage, setCurrentPage] = useState(1);

    const handleSearch = (query) => {
        setQueryInput(query);
        setActiveQuery(query);
        setCurrentPage(1);
    };

    const handleFilterChange = (nextFilters) => {
        setFilters(nextFilters);
        setCurrentPage(1);
    };

    const handleClearAll = () => {
        setFilters(DEFAULT_FILTERS);
        setCurrentPage(1);
    };

    const filteredProducts = useMemo(() => {
        let result = searchProducts.filter((product) => {
            const matchesQuery =
                !activeQuery || product.name.toLowerCase().includes(activeQuery.toLowerCase());
            const matchesBrand = filters.brands.length === 0 || filters.brands.includes(product.brand);
            const matchesMaterial =
                filters.materials.length === 0 || filters.materials.includes(product.material);
            const matchesFeatures =
                filters.features.length === 0 ||
                filters.features.every((f) => product.features.includes(f));
            const matchesPrice = product.price <= filters.maxPrice;
            return matchesQuery && matchesBrand && matchesMaterial && matchesFeatures && matchesPrice;
        });

        if (sortBy === 'price-high') result = [...result].sort((a, b) => b.price - a.price);
        if (sortBy === 'price-low') result = [...result].sort((a, b) => a.price - b.price);
        if (sortBy === 'best-selling') result = [...result].sort((a, b) => b.reviewCount - a.reviewCount);

        return result;
    }, [activeQuery, filters, sortBy]);

    const totalPages = Math.max(1, Math.ceil(filteredProducts.length / PAGE_SIZE));
    const paginatedProducts = filteredProducts.slice(
        (currentPage - 1) * PAGE_SIZE,
        currentPage * PAGE_SIZE
    );

    const heading = activeQuery ? `Results for "${activeQuery}"` : 'All Accessories';

    return (
        <div className={styles.page}>
            <SearchHeroSection query={queryInput} onQueryChange={setQueryInput} onSearch={handleSearch} />

            <section className={styles.resultsSection}>
                <SearchFiltersSidebar
                    filters={filters}
                    onFilterChange={handleFilterChange}
                    onClearAll={handleClearAll}
                />
                <SearchResultsGrid
                    heading={heading}
                    products={paginatedProducts}
                    totalCount={filteredProducts.length}
                    sortBy={sortBy}
                    onSortChange={setSortBy}
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={setCurrentPage}
                />
            </section>

            <BundleSuggestionsSection />
            <RecommendedForYouSection />

            <div className={styles.newsletterSection}>
                <NewsletterSignup variant="dark" />
            </div>
        </div>
    );
}

export default SearchResultsPage;