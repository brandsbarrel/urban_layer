import { useEffect } from 'react';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
    selectWishlistItems,
    selectWishlistAvailableCount,
    selectWishlistTotalValue,
    selectWishlistLoading,
    removeFromWishlistAsync,
    removeItems,
    clearWishlist,
    fetchWishlist,
    addToWishlistAsync
} from '../../redux/slices/wishlistSlice';
import { addToCartAsync } from '../../redux/slices/cartSlice';
import WishlistHeader from './sections/WishlistHeader';
import PriceDropAlert from './sections/PriceDropAlert';
import BulkActionsBar from './sections/BulkActionsBar';
import WishlistProductGrid from './sections/WishlistProductGrid';
import RecommendationsSection from './sections/RecommendationsSection';
import TrendingCollectionsSection from './sections/TrendingCollectionsSection';
import styles from './WishlistPage.module.css';

function WishlistPage() {
    const dispatch = useDispatch();
    const items = useSelector(selectWishlistItems);
    const availableCount = useSelector(selectWishlistAvailableCount);
    const totalValue = useSelector(selectWishlistTotalValue);
    const loading = useSelector(selectWishlistLoading);

    const [selectedIds, setSelectedIds] = useState([]);

    // Fetch wishlist on mount
    useEffect(() => {
        dispatch(fetchWishlist());
    }, [dispatch]);

    const allSelected = items.length > 0 && selectedIds.length === items.length;

    const handleToggleSelect = (id) => {
        setSelectedIds((prev) => (prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]));
    };

    const handleToggleSelectAll = () => {
        setSelectedIds(allSelected ? [] : items.map((item) => item.id));
    };

    const handleRemoveSelected = () => {
        selectedIds.forEach(id => {
            dispatch(removeFromWishlistAsync(id));
        });
        setSelectedIds([]);
    };

    const handleRemove = (id) => {
        dispatch(removeFromWishlistAsync(id));
        setSelectedIds((prev) => prev.filter((i) => i !== id));
    };

    const handleMoveToCart = (item) => {
        dispatch(addToCartAsync({ productId: item.id, quantity: 1 }));
        dispatch(removeFromWishlistAsync(item.id));
        setSelectedIds((prev) => prev.filter((i) => i !== item.id));
    };

    const handleMoveAllToCart = () => {
        items.forEach((item) => {
            dispatch(addToCartAsync({ productId: item.id, quantity: 1 }));
            dispatch(removeFromWishlistAsync(item.id));
        });
        setSelectedIds([]);
    };

    if (loading && items.length === 0) {
        return (
            <div className={styles.page} style={{ padding: '80px 20px', textAlign: 'center' }}>
                <div style={{
                    width: '40px',
                    height: '40px',
                    margin: '0 auto 16px',
                    border: '3px solid #eee',
                    borderTopColor: '#111',
                    borderRadius: '50%',
                    animation: 'spin 0.8s linear infinite'
                }} />
                <p style={{ color: '#666', fontWeight: 500 }}>Loading your wishlist...</p>
                <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
            </div>
        );
    }

    return (
        <div className={styles.page}>
            <WishlistHeader
                savedCount={items.length}
                availableCount={availableCount}
                totalValue={totalValue}
            />
            <PriceDropAlert />
            <BulkActionsBar
                allSelected={allSelected}
                onToggleSelectAll={handleToggleSelectAll}
                onRemoveSelected={handleRemoveSelected}
                onMoveAllToCart={handleMoveAllToCart}
            />
            <WishlistProductGrid
                items={items}
                selectedIds={selectedIds}
                onToggleSelect={handleToggleSelect}
                onMoveToCart={handleMoveToCart}
                onRemove={handleRemove}
            />
            <RecommendationsSection />
            <TrendingCollectionsSection />
        </div>
    );
}

export default WishlistPage;