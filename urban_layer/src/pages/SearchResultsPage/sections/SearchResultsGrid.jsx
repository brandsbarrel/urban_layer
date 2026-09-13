import ProductCard from '../../../components/ProductCard/ProductCard';
import Pagination from '../../../components/Pagination/Pagination';
import styles from './SearchResultsGrid.module.css';

const SORT_OPTIONS = [
    { value: 'newest', label: 'Newest Arrivals' },
    { value: 'price-high', label: 'Price: High to Low' },
    { value: 'price-low', label: 'Price: Low to High' },
    { value: 'best-selling', label: 'Best Selling' },
];

function SearchResultsGrid({
    heading,
    products,
    totalCount,
    loading,
    error,
    sortBy,
    onSortChange,
    currentPage,
    totalPages,
    onPageChange,
    pageSize = 8,
}) {
    const startIndex = totalCount === 0 ? 0 : (currentPage - 1) * pageSize + 1;
    const endIndex = startIndex === 0 ? 0 : startIndex + products.length - 1;

    return (
        <div className={styles.wrapper}>
            <div className={styles.header}>
                <div>
                    <h2 className={styles.heading}>{heading}</h2>
                    <p className={styles.resultsText}>
                        Showing {startIndex}-{endIndex} of {totalCount} premium accessories
                    </p>
                </div>
                <div className={styles.sortWrapper}>
                    <label className={styles.sortLabel} htmlFor="search-sort">
                        Sort By:
                    </label>
                    <select
                        id="search-sort"
                        value={sortBy}
                        onChange={(e) => onSortChange(e.target.value)}
                        className={styles.sortSelect}
                    >
                        {SORT_OPTIONS.map((option) => (
                            <option key={option.value} value={option.value}>
                                {option.label}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            {loading ? (
                <p className={styles.emptyState}>Loading results...</p>
            ) : error ? (
                <p className={styles.emptyState}>Unable to load results. Please try again shortly.</p>
            ) : products.length === 0 ? (
                <p className={styles.emptyState}>No results found. Try adjusting your filters.</p>
            ) : (
                <div className={styles.grid}>
                    {products.map((product, index) => (
                        <ProductCard
                            key={product.id || product.slug}
                            product={product}
                            variant="iconOverlay"
                            badgePosition={index === 3 ? 'right' : 'left'}
                        />
                    ))}
                </div>
            )}

            {!loading && !error && totalPages > 1 && (
                <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={onPageChange} />
            )}
        </div>
    );
}

export default SearchResultsGrid;
