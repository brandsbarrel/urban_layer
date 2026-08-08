import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import WishlistThumbnailCard from '../../../components/WishlistThumbnailCard/WishlistThumbnailCard';
import { selectWishlistItems, removeItem } from '../../../redux/slices/wishlistSlice';
import styles from './WishlistHighlightsSection.module.css';

function WishlistHighlightsSection() {
    const dispatch = useDispatch();
    const items = useSelector(selectWishlistItems).slice(0, 4);

    return (
        <section>
            <div className={styles.header}>
                <h2 className={styles.heading}>Wishlist Highlights</h2>
                <Link to="/wishlist" className={styles.viewAllLink}>
                    Explore All
                </Link>
            </div>
            {items.length === 0 ? (
                <p className={styles.emptyState}>Your wishlist is empty.</p>
            ) : (
                <div className={styles.grid}>
                    {items.map((item) => (
                        <WishlistThumbnailCard
                            key={item.id}
                            item={item}
                            onRemove={(id) => dispatch(removeItem(id))}
                        />
                    ))}
                </div>
            )}
        </section>
    );
}

export default WishlistHighlightsSection;