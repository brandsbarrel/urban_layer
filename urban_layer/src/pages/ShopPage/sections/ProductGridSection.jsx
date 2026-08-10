import ProductCard from '../../../components/ProductCard/ProductCard';
import Pagination from '../../../components/Pagination/Pagination';
import styles from './ProductGridSection.module.css';

const SORT_OPTIONS = [
    { value: 'best-sellers', label: 'Sort by: Best Sellers' },
    { value: 'newest', label: 'Newest First' },
    { value: 'price-high', label: 'Price: High to Low' },
    { value: 'price-low', label: 'Price: Low to High' },
];

function ProductGridSection({ products, sortBy, onSortChange, currentPage, totalPages, onPageChange }) {
    return (
        <div id="product-grid" className={styles.grid}>
            <div className={styles.header}>
                <p className={styles.resultsText}>
                    Showing <span className={styles.resultsCount}>{products.length}</span> results
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
                <p className={styles.emptyState}>No products match your filters. Try adjusting them.</p>
            ) : (
                <div className={styles.productsGrid}>
                    {products.map((product) => (
                        <ProductCard key={product.id} product={product} variant="detailed" />
                    ))}
                </div>
            )}

            <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={onPageChange} />
        </div>
    );
}

export default ProductGridSection;