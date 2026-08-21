import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import CartItemCard from '../../../components/CartItemCard/CartItemCard';
import ShippingProgressBar from '../../../components/ShippingProgressBar/ShippingProgressBar';
import FrequentlyBoughtTogetherCard from '../../../components/FrequentlyBoughtTogetherCard/FrequentlyBoughtTogetherCard';
import {
    selectCartItems,
    updateCartItemAsync,
    removeFromCartAsync,
    moveToSaved,
} from '../../../redux/slices/cartSlice';
import { calculateCartTotals } from '../../../utils/pricing';
import styles from './CartItemsSection.module.css';

const BUNDLE = {
    id: 'essential-protection-bundle',
    images: [
        'https://lh3.googleusercontent.com/aida-public/AB6AXuB3TWmXanaF3qUHevTh_Zw-xiQ9mgDDZcHx__g5zyBIf6oRi_6KBedIU3gMbKRudE2rVhVl1QtsvRVnIICj95ax8aWNHEspnLqNAA0ohmeMEAJDKVuXJPfuwCHE8UY4Wlu5nu3aWVALuSEFY6mJao9b_k3LWxXDS-zmXdPhzTc_J_TmZ8oGTK73mcHb9mudta528w3cwDEtpKD4r1HxV8Y621o56emcZog_X-9XHZePCViM4TVC-9krlZFjtSTg0IYnDT0WssCukNw',
        'https://lh3.googleusercontent.com/aida-public/AB6AXuA2QyEMPM8RFTHk7a8TPlXEFKOdzXjHn6_Y1g7WtCjKRtHcGUeUzIuiXf_W2-FfPZNPDMZXe-E8JxiWGL1gnlfoqZ9qJHTbSkNeSOanN3aRTcllwj2-wjNK995LGYrVU3euJ1KkGVcGXZ75My8HnWU_fL4I7-1kDV7Pn2sao0_IU4MEBlFwrwZTNnJlEOZMMZs_7XWdcj7_pS66c5eb6JClPQQOuURWVFlzGp-soLi5l8L0_T2sLTlFKEXFgDDe8iayv4C86QmRjoM',
    ],
    title: 'Essential Protection Bundle',
    description: 'Screen Protector + Lens Guard + Cleaning Kit',
    price: 2499,
    originalPrice: 3999,
};

function CartItemsSection() {
    const dispatch = useDispatch();
    const items = useSelector(selectCartItems);
    const { subtotal, shippingProgress, amountToFreeShipping, isFreeShipping } =
        calculateCartTotals(items, null);

    if (items.length === 0) {
        return (
            <div className={styles.emptyState}>
                <p className={styles.emptyText}>Your cart is empty.</p>
                <Link to="/shop" className={styles.emptyLink}>
                    Continue Shopping
                </Link>
            </div>
        );
    }

    return (
        <div className={styles.column}>
            <ShippingProgressBar
                progress={shippingProgress}
                amountRemaining={amountToFreeShipping}
                isFree={isFreeShipping}
            />

            {items.map((item) => (
                <CartItemCard
                    key={item.id}
                    item={item}
                    onIncrement={(id) => dispatch(updateCartItemAsync({ productId: id, quantity: (item.quantity || 1) + 1 }))}
                    onDecrement={(id) => dispatch(updateCartItemAsync({ productId: id, quantity: Math.max(1, (item.quantity || 1) - 1) }))}
                    onSaveForLater={(id) => dispatch(moveToSaved(id))}
                    onRemove={(id) => dispatch(removeFromCartAsync({ productId: id }))}
                />
            ))}

            <div className={styles.upsell}>
                <h2 className={styles.upsellHeading}>Frequently Bought Together</h2>
                <FrequentlyBoughtTogetherCard {...BUNDLE} />
            </div>
        </div>
    );
}

export default CartItemsSection;