import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
    selectWishlistItems,
    selectWishlistAvailableCount,
    selectWishlistTotalValue,
    removeItem,
    removeItems,
    clearWishlist,
} from '../../redux/slices/wishlistSlice';
import { addToCart } from '../../redux/slices/cartSlice';
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

    const [selectedIds, setSelectedIds] = useState([]);

    const allSelected = items.length > 0 && selectedIds.length === items.length;

    const handleToggleSelect = (id) => {
        setSelectedIds((prev) => (prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]));
    };

    const handleToggleSelectAll = () => {
        setSelectedIds(allSelected ? [] : items.map((item) => item.id));
    };

    const handleRemoveSelected = () => {
        dispatch(removeItems(selectedIds));
        setSelectedIds([]);
    };

    const handleRemove = (id) => {
        dispatch(removeItem(id));
        setSelectedIds((prev) => prev.filter((i) => i !== id));
    };

    const handleMoveToCart = (item) => {
        dispatch(addToCart({ id: item.id, name: item.name, price: item.price, image: item.image }));
        dispatch(removeItem(item.id));
        setSelectedIds((prev) => prev.filter((i) => i !== item.id));
    };

    const handleMoveAllToCart = () => {
        items.forEach((item) => {
            dispatch(addToCart({ id: item.id, name: item.name, price: item.price, image: item.image }));
        });
        dispatch(clearWishlist());
        setSelectedIds([]);
    };

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