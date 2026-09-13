import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { MdClose, MdTune } from 'react-icons/md';
import NewsletterSignup from '../../components/NewsletterSignup/NewsletterSignup';
import SearchHeroSection from './sections/SearchHeroSection';
import SearchFiltersSidebar from './sections/SearchFiltersSidebar';
import SearchResultsGrid from './sections/SearchResultsGrid';
import BundleSuggestionsSection from './sections/BundleSuggestionsSection';
import RecommendedForYouSection from './sections/RecommendedForYouSection';
import { searchPriceRange } from '../../services/searchResultsData';
import { getProducts, slugifyValue } from '../../services/productsService';
import styles from './SearchResultsPage.module.css';

const PAGE_SIZE = 8;
const DEFAULT_FILTERS = {
    brands: [],
    materials: [],
    features: [],
    maxPrice: searchPriceRange.max,
};

const buildMaterialOptions = (products = []) => {
    const options = new Map();
    products.forEach((product) => {
        const label = product.collection || product.material || '';
        const id = slugifyValue(product.material || product.collection || '');
        if (id && label && !options.has(id)) {
            options.set(id, { id, label });
        }
    });
    return Array.from(options.values());
};

function SearchResultsPage() {
    const [searchParams, setSearchParams] = useSearchParams();
    const [queryInput, setQueryInput] = useState(searchParams.get('q') || '');
    const [activeQuery, setActiveQuery] = useState(searchParams.get('q') || '');
    const [filters, setFilters] = useState(DEFAULT_FILTERS);
    const [sortBy, setSortBy] = useState('newest');
    const [currentPage, setCurrentPage] = useState(1);
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [apiProducts, setApiProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const searchParamsKey = searchParams.toString();

    useEffect(() => {
        const query = searchParams.get('q') || '';
        setQueryInput(query);
        setActiveQuery(query);
        setCurrentPage(1);
    }, [searchParamsKey]);

    useEffect(() => {
        let isMounted = true;

        const loadResults = async () => {
            setLoading(true);
            setError(null);

            try {
                const response = await getProducts({
                    page: 1,
                    perPage: 100,
                    search: activeQuery,
                    maxPrice: filters.maxPrice,
                    sortBy: 'newest',
                });
                if (isMounted) {
                    setApiProducts(response?.data?.items || []);
                    setLoading(false);
                }
            } catch (err) {
                if (isMounted) {
                    setApiProducts([]);
                    setError(err.message || 'Failed to load search results.');
                    setLoading(false);
                }
            }
        };

        loadResults();

        return () => {
            isMounted = false;
        };
    }, [activeQuery, filters.maxPrice]);

    const handleSearch = (query) => {
        setQueryInput(query);
        setActiveQuery(query);
        setCurrentPage(1);
        const nextQuery = query.trim();
        setSearchParams(nextQuery ? { q: nextQuery } : {}, { replace: true });
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
        let result = apiProducts.filter((product) => {
            const matchesQuery =
                !activeQuery || product.name.toLowerCase().includes(activeQuery.toLowerCase());
            const productBrand = slugifyValue(product.brand || product.phoneModel?.brand || '');
            const matchesBrand = filters.brands.length === 0 || filters.brands.includes(productBrand);
            const matchesMaterial =
                filters.materials.length === 0 ||
                filters.materials.some((material) =>
                    [
                        product.material,
                        product.collection,
                        ...(product.categories || []).flatMap((category) => [
                            category.slug,
                            category.id,
                            category.name,
                        ]),
                    ].some((value) => slugifyValue(value) === material)
                );
            const matchesFeatures =
                filters.features.length === 0 ||
                filters.features.every((feature) =>
                    (product.tags || []).some((tag) => slugifyValue(tag) === feature)
                );
            const matchesPrice = product.price <= filters.maxPrice;
            return matchesQuery && matchesBrand && matchesMaterial && matchesFeatures && matchesPrice;
        });

        if (sortBy === 'price-high') result = [...result].sort((a, b) => b.price - a.price);
        if (sortBy === 'price-low') result = [...result].sort((a, b) => a.price - b.price);
        if (sortBy === 'best-selling') result = [...result].sort((a, b) => b.reviewCount - a.reviewCount);

        return result;
    }, [activeQuery, apiProducts, filters, sortBy]);

    const totalPages = Math.max(1, Math.ceil(filteredProducts.length / PAGE_SIZE));
    const paginatedProducts = filteredProducts.slice(
        (currentPage - 1) * PAGE_SIZE,
        currentPage * PAGE_SIZE
    );

    const heading = activeQuery ? `Results for "${activeQuery}"` : 'All Accessories';
    const activeFilterCount =
        filters.brands.length +
        filters.materials.length +
        filters.features.length +
        (filters.maxPrice < searchPriceRange.max ? 1 : 0);
    const materialOptions = useMemo(() => buildMaterialOptions(apiProducts), [apiProducts]);

    useEffect(() => {
        if (!isFilterOpen) return undefined;

        const previousOverflow = document.body.style.overflow;
        document.body.style.overflow = 'hidden';

        return () => {
            document.body.style.overflow = previousOverflow;
        };
    }, [isFilterOpen]);

    return (
        <div className={styles.page}>
            <SearchHeroSection query={queryInput} onQueryChange={setQueryInput} onSearch={handleSearch} />

            <div className={styles.mobileFilterBar}>
                <button
                    type="button"
                    className={styles.filterToggle}
                    onClick={() => setIsFilterOpen(true)}
                    aria-label={`Open filters${activeFilterCount ? `, ${activeFilterCount} active` : ''}`}
                >
                    <MdTune size={20} />
                    <span>Filters</span>
                    {activeFilterCount > 0 && <strong>{activeFilterCount}</strong>}
                </button>
            </div>

            <section className={styles.resultsSection}>
                <div className={`${styles.filterPanel} ${isFilterOpen ? styles.filterPanelOpen : ''}`}>
                    <div className={styles.filterPanelHeader}>
                        <h2 className={styles.filterPanelTitle}>Filters</h2>
                        <button type="button" onClick={() => setIsFilterOpen(false)} aria-label="Close filters">
                            <MdClose size={22} />
                        </button>
                    </div>
                    <SearchFiltersSidebar
                        filters={filters}
                        materialOptions={materialOptions}
                        onFilterChange={handleFilterChange}
                        onClearAll={handleClearAll}
                    />
                    <button type="button" className={styles.applyFiltersButton} onClick={() => setIsFilterOpen(false)}>
                        Apply Filters
                    </button>
                </div>
                {isFilterOpen && <button type="button" className={styles.filterBackdrop} onClick={() => setIsFilterOpen(false)} aria-label="Close filters" />}
                <SearchResultsGrid
                    heading={heading}
                    products={paginatedProducts}
                    totalCount={filteredProducts.length}
                    loading={loading}
                    error={error}
                    sortBy={sortBy}
                    onSortChange={setSortBy}
                    currentPage={currentPage}
                    totalPages={totalPages}
                    pageSize={PAGE_SIZE}
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
