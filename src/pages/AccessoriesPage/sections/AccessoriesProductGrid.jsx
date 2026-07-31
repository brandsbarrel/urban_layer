import { useState } from 'react';
import ProductCard from '../../../components/ProductCard/ProductCard';
import styles from './AccessoriesProductGrid.module.css';

const SORT_OPTIONS = [
    { value: 'newest', label: 'Sort by: Newest' },
    { value: 'price-low', label: 'Price: Low to High' },
    { value: 'price-high', label: 'Price: High to Low' },
    { value: 'best-selling', label: 'Best Selling' },
];

const PAGE_SIZE = 2;

function AccessoriesProductGrid({ products, sortBy, onSortChange }) {
    const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
    const visibleProducts = products.slice(0, visibleCount);
    const hasMore = visibleCount < products.length;

    return (
        <div id="accessories-grid" className={styles.wrapper}>
            <div className={styles.header}>
                <span className={styles.resultsText}>Showing {products.length} products</span>
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

            {visibleProducts.length === 0 ? (
                <p className={styles.emptyState}>No accessories match your filters.</p>
            ) : (
                <div className={styles.grid}>
                    {visibleProducts.map((product) => (
                        <ProductCard key={product.id} product={product} variant="reveal" />
                    ))}
                </div>
            )}

            {hasMore && (
                <div className={styles.loadMoreWrapper}>
                    <button
                        type="button"
                        onClick={() => setVisibleCount((prev) => prev + PAGE_SIZE)}
                        className={styles.loadMoreButton}
                    >
                        LOAD MORE ACCESSORIES
                    </button>
                </div>
            )}
        </div>
    );
}

export default AccessoriesProductGrid;