import ProductCard from '../../../components/ProductCard/ProductCard';
import Pagination from '../../../components/Pagination/Pagination';
import styles from './ProductGridSection.module.css';

const SORT_OPTIONS = [
    { value: 'best-sellers', label: 'Sort by: Best Sellers' },
    { value: 'newest', label: 'Newest First' },
    { value: 'price-high', label: 'Price: High to Low' },
    { value: 'price-low', label: 'Price: Low to High' },
];

function ProductGridSection({
    products = [],
    loading,
    sortBy,
    onSortChange,
    currentPage,
    totalPages,
    totalItems,
    error,
    onPageChange,
}) {
    if (loading) {
        return (
            <div id="product-grid" className={styles.grid}>
                <div className={styles.header}>
                    <p className={styles.resultsText}>Loading catalog...</p>
                </div>
                <div className={styles.productsGrid}>
                    {Array.from({ length: 6 }).map((_, index) => (
                        <div key={index} style={{
                            height: '340px',
                            background: 'var(--color-surface-hover, #f3f3f3)',
                            borderRadius: '12px',
                            animation: 'pulse 1.5s infinite ease-in-out'
                        }} />
                    ))}
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div id="product-grid" className={styles.grid}>
                <div className={styles.emptyState}>
                    <p style={{ marginBottom: '1rem', color: '#c53030' }}>Unable to load products. Please check back shortly.</p>
                </div>
            </div>
        );
    }

    return (
        <div id="product-grid" className={styles.grid}>
            <div className={styles.header}>
                <p className={styles.resultsText}>
                    Showing <span className={styles.resultsCount}>{totalItems}</span> products
                </p>

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

            {products.length === 0 ? (
                <div className={styles.emptyState}>
                    <p>No products match your selected filters.</p>
                </div>
            ) : (
                <div className={styles.productsGrid}>
                    {products.map((product) => (
                        <ProductCard
                            key={product.id || product.slug}
                            product={product}
                            variant="detailed"
                        />
                    ))}
                </div>
            )}

            {totalPages > 1 && (
                <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={onPageChange}
                />
            )}
        </div>
    );
}

export default ProductGridSection;
