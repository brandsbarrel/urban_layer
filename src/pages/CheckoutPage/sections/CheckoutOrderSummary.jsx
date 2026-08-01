import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { MdLock, MdVerified, MdSupportAgent, MdArrowForward } from 'react-icons/md';
import OrderSummaryLineItem from '../../../components/OrderSummaryLineItem/OrderSummaryLineItem';
import { selectCartItems } from '../../../redux/slices/cartSlice';
import { calculateCartTotals, EXPRESS_SHIPPING_FEE } from '../../../utils/pricing';
import styles from './CheckoutOrderSummary.module.css';

function CheckoutOrderSummary({ selectedMethod }) {
    const navigate = useNavigate();
    const items = useSelector(selectCartItems);

    const shippingOverride = selectedMethod === 'express' ? EXPRESS_SHIPPING_FEE : 0;
    const { subtotal, shipping, tax, total, isFreeShipping } = calculateCartTotals(
        items,
        null,
        shippingOverride
    );

    const handlePlaceOrder = () => {
        navigate('/order-success');
    };

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

                <div className={styles.breakdown}>
                    <div className={styles.row}>
                        <span>Subtotal</span>
                        <span>₹{subtotal.toLocaleString('en-IN')}</span>
                    </div>
                    <div className={styles.row}>
                        <span>Shipping</span>
                        <span className={isFreeShipping ? styles.freeLabel : undefined}>
                            {isFreeShipping ? 'Free' : `₹${shipping.toLocaleString('en-IN')}`}
                        </span>
                    </div>
                    <div className={styles.row}>
                        <span>Estimated Tax</span>
                        <span>₹{tax.toLocaleString('en-IN')}</span>
                    </div>
                    <div className={styles.totalRow}>
                        <span>Total</span>
                        <span>₹{total.toLocaleString('en-IN')}</span>
                    </div>
                </div>

                <button type="button" onClick={handlePlaceOrder} className={styles.placeOrderButton}>
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