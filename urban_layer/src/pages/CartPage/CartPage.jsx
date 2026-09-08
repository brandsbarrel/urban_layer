import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { selectCartItems, selectCartLoading, selectCartError, fetchCart } from '../../redux/slices/cartSlice';
import CartItemsSection from './sections/CartItemsSection';
import OrderSummarySection from './sections/OrderSummarySection';
import styles from './CartPage.module.css';

function CartPage() {
    const dispatch = useDispatch();
    const items = useSelector(selectCartItems);
    const loading = useSelector(selectCartLoading);
    const error = useSelector(selectCartError);
    const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

    useEffect(() => {
        dispatch(fetchCart());
    }, [dispatch]);

    const renderSkeleton = () => (
        <div className={styles.page}>
            <header className={styles.header}>
                <span className={`${styles.skeletonLine} ${styles.skeletonTitle}`} />
                <span className={`${styles.skeletonLine} ${styles.skeletonSubtitle}`} />
            </header>
            <div className={styles.grid}>
                <div className={styles.skeletonItems}>
                    {[0, 1, 2].map((item) => (
                        <div className={styles.skeletonCartCard} key={item}>
                            <span className={styles.skeletonImage} />
                            <div className={styles.skeletonContent}>
                                <span className={styles.skeletonLine} />
                                <span className={`${styles.skeletonLine} ${styles.skeletonSubtitle}`} />
                                <span className={`${styles.skeletonLine} ${styles.skeletonActions}`} />
                            </div>
                        </div>
                    ))}
                </div>
                <div className={styles.skeletonSummary}>
                    <span className={`${styles.skeletonLine} ${styles.skeletonTitle}`} />
                    <span className={styles.skeletonLine} />
                    <span className={styles.skeletonLine} />
                    <span className={`${styles.skeletonLine} ${styles.skeletonActions}`} />
                </div>
            </div>
        </div>
    );

    if (loading && items.length === 0) {
        return renderSkeleton();
    }

    if (error && items.length === 0) {
        return (
            <div className={styles.page}>
                <div className={styles.error}>
                    <p className={styles.errorText}>{error}</p>
                    <button onClick={() => dispatch(fetchCart())} className={styles.retryButton}>
                        Retry
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className={styles.page}>
            <header className={styles.header}>
                <h1 className={styles.heading}>Shopping Cart</h1>
                <p className={styles.subtitle}>
                    {itemCount} {itemCount === 1 ? 'Premium Product' : 'Premium Products'}
                </p>
            </header>

            <div className={styles.grid}>
                <CartItemsSection />
                <OrderSummarySection />
            </div>
        </div>
    );
}

export default CartPage;
