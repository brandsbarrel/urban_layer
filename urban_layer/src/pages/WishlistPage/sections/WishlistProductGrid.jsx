import WishlistProductCard from '../../../components/WishlistProductCard/WishlistProductCard';
import styles from './WishlistProductGrid.module.css';

function WishlistProductGrid({ items, selectedIds, onToggleSelect, onMoveToCart, onRemove }) {
    if (items.length === 0) {
        return <p className={styles.emptyState}>Your wishlist is empty. Start adding items you love!</p>;
    }

    return (
        <div className={styles.grid}>
            {items.map((item) => (
                <WishlistProductCard
                    key={item.id}
                    item={item}
                    selected={selectedIds.includes(item.id)}
                    onToggleSelect={onToggleSelect}
                    onMoveToCart={onMoveToCart}
                    onRemove={onRemove}
                />
            ))}
        </div>
    );
}

export default WishlistProductGrid;