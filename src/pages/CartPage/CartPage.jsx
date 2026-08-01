import { useSelector } from 'react-redux';
import { selectCartItems } from '../../redux/slices/cartSlice';
import CartItemsSection from './sections/CartItemsSection';
import OrderSummarySection from './sections/OrderSummarySection';
import styles from './CartPage.module.css';

function CartPage() {
    const items = useSelector(selectCartItems);
    const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

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