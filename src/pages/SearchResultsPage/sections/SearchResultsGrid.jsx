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
    sortBy,
    onSortChange,
    currentPage,
    totalPages,
    onPageChange,
}) {
    const startIndex = totalCount === 0 ? 0 : (currentPage - 1) * products.length + 1;
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
                    <span className={styles.sortLabel}>Sort By:</span>
                    <select
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

            {products.length === 0 ? (
                <p className={styles.emptyState}>No results found. Try adjusting your filters.</p>
            ) : (
                <div className={styles.grid}>
                    {products.map((product, index) => (
                        <ProductCard
                            key={product.id}
                            product={product}
                            variant="iconOverlay"
                            badgePosition={index === 3 ? 'right' : 'left'}
                        />
                    ))}
                </div>
            )}

            <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={onPageChange} />
        </div>
    );
}

export default SearchResultsGrid;