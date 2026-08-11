import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { MdLock, MdVerified, MdSupportAgent, MdArrowForward } from 'react-icons/md';
import OrderSummaryLineItem from '../../../components/OrderSummaryLineItem/OrderSummaryLineItem';
import PriceBreakdownList from '../../../components/PriceBreakdownList/PriceBreakdownList';
import { selectCartItems, clearCart } from '../../../redux/slices/cartSlice';
import { placeOrder } from '../../../redux/slices/ordersSlice';
import { calculateCartTotals, EXPRESS_SHIPPING_FEE } from '../../../utils/pricing';
import { generateOrderId, calculateEstimatedDelivery } from '../../../utils/orderHelpers';
import styles from './CheckoutOrderSummary.module.css';

function CheckoutOrderSummary({ selectedMethod, contactInfo, address }) {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const items = useSelector(selectCartItems);

    const shippingOverride = selectedMethod === 'express' ? EXPRESS_SHIPPING_FEE : 0;
    const { subtotal, shipping, tax, total, isFreeShipping } = calculateCartTotals(
        items,
        null,
        shippingOverride
    );

    const handlePlaceOrder = () => {
        if (items.length === 0) return;
        const placedAt = new Date().toISOString();
        const order = {
            id: generateOrderId(),
            placedAt,
            status: 'processing', // Confirmed step complete, Processing is now active
            items,
            contactInfo,
            shippingAddress: address,
            deliveryMethod: selectedMethod,
            estimatedDelivery: calculateEstimatedDelivery(selectedMethod, new Date(placedAt)),
            totals: { subtotal, shipping, tax, total },
        };
        dispatch(placeOrder(order));
        dispatch(clearCart());
        navigate('/order-success');
    };

    const lines = [
        { label: 'Subtotal', value: `₹${subtotal.toLocaleString('en-IN')}` },
        {
            label: 'Shipping',
            value: isFreeShipping ? 'Free' : `₹${shipping.toLocaleString('en-IN')}`,
            highlight: isFreeShipping,
        },
        { label: 'Estimated Tax', value: `₹${tax.toLocaleString('en-IN')}` },
    ];

    return (
        <aside className={styles.sidebar}>
            <div className={styles.card}>
                <h3 className={styles.heading}>Order Summary</h3>

                <div className={styles.itemsList}>
                    {items.map((item) => (
                        <OrderSummaryLineItem
                            key={item.id}
                            image={item.image}
                            name={item.name}
                            subtitle={item.subtitle}
                            price={item.price * item.quantity}
                        />
                    ))}
                </div>

                <div className={styles.divider} />

                <PriceBreakdownList lines={lines} total={`₹${total.toLocaleString('en-IN')}`} />

                <button
                    type="button"
                    onClick={handlePlaceOrder}
                    className={styles.placeOrderButton}
                    disabled={items.length === 0}
                >
                    Place Order
                    <MdArrowForward size={18} className={styles.placeOrderIcon} />
                </button>

                <div className={styles.trustRow}>
                    <div className={styles.trustItem}>
                        <MdLock size={20} />
                        <span>SSL Secure</span>
                    </div>
                    <div className={styles.trustItem}>
                        <MdVerified size={20} />
                        <span>Encrypted</span>
                    </div>
                    <div className={styles.trustItem}>
                        <MdSupportAgent size={20} />
                        <span>24/7 Support</span>
                    </div>
                </div>
            </div>
        </aside>
    );
}

export default CheckoutOrderSummary;