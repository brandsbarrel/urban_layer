import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { MdVerifiedUser, MdLock, MdLocalShipping } from 'react-icons/md';
import PromoCodeInput from '../../../components/PromoCodeInput/PromoCodeInput';
import {
    selectCartItems,
    selectPromoCode,
    selectPromoError,
    applyPromoCode,
    clearPromoCode,
} from '../../../redux/slices/cartSlice';
import { calculateCartTotals } from '../../../utils/pricing';
import styles from './OrderSummarySection.module.css';

function OrderSummarySection() {
    const dispatch = useDispatch();
    const items = useSelector(selectCartItems);
    const promoCode = useSelector(selectPromoCode);
    const promoError = useSelector(selectPromoError);

    const { subtotal, discount, shipping, tax, total, isFreeShipping } = calculateCartTotals(
        items,
        promoCode
    );

    return (
        <div className={styles.sidebar}>
            <div className={styles.summaryCard}>
                <h2 className={styles.heading}>Order Summary</h2>

                <div className={styles.lineItems}>
                    <div className={styles.lineItem}>
                        <span>Subtotal</span>
                        <span>₹{subtotal.toLocaleString('en-IN')}</span>
                    </div>
                    {discount > 0 && (
                        <div className={styles.lineItem}>
                            <span>Discount ({promoCode})</span>
                            <span className={styles.discountValue}>-₹{discount.toLocaleString('en-IN')}</span>
                        </div>
                    )}
                    <div className={styles.lineItem}>
                        <span>Shipping</span>
                        <span className={isFreeShipping ? styles.freeValue : undefined}>
                            {isFreeShipping ? 'FREE' : `₹${shipping.toLocaleString('en-IN')}`}
                        </span>
                    </div>
                    <div className={styles.lineItem}>
                        <span>Taxes</span>
                        <span>₹{tax.toLocaleString('en-IN')}</span>
                    </div>
                </div>

                <div className={styles.totalRow}>
                    <span>Total</span>
                    <span>₹{total.toLocaleString('en-IN')}</span>
                </div>

                <div className={styles.actions}>
                    <Link to="/checkout" className={styles.checkoutButton}>
                        Proceed to Checkout
                    </Link>
                    <Link to="/shop" className={styles.continueButton}>
                        Continue Shopping
                    </Link>
                </div>

                <div className={styles.trustRow}>
                    <div className={styles.trustItem}>
                        <MdVerifiedUser size={20} />
                        <span>SSL Secure</span>
                    </div>
                    <div className={styles.trustItem}>
                        <MdLock size={20} />
                        <span>Encrypted</span>
                    </div>
                    <div className={styles.trustItem}>
                        <MdLocalShipping size={20} />
                        <span>Easy Returns</span>
                    </div>
                </div>
            </div>

            <PromoCodeInput
                appliedCode={promoCode}
                error={promoError}
                onApply={(code) => dispatch(applyPromoCode(code))}
                onClear={() => dispatch(clearPromoCode())}
            />
        </div>
    );
}

export default OrderSummarySection;