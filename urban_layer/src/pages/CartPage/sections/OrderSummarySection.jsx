import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { MdVerifiedUser, MdLock, MdLocalShipping } from 'react-icons/md';
import PromoCodeInput from '../../../components/PromoCodeInput/PromoCodeInput';
import PriceBreakdownList from '../../../components/PriceBreakdownList/PriceBreakdownList';
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

    const lines = [
        { label: 'Subtotal', value: `₹${subtotal.toLocaleString('en-IN')}` },
        ...(discount > 0
            ? [
                {
                    label: `Discount (${promoCode})`,
                    value: `-₹${discount.toLocaleString('en-IN')}`,
                    highlight: true,
                },
            ]
            : []),
        {
            label: 'Shipping',
            value: isFreeShipping ? 'FREE' : `₹${shipping.toLocaleString('en-IN')}`,
            highlight: isFreeShipping,
        },
        { label: 'Taxes', value: `₹${tax.toLocaleString('en-IN')}` },
    ];

    return (
        <div className={styles.sidebar}>
            <div className={styles.summaryCard}>
                <h2 className={styles.heading}>Order Summary</h2>

                <PriceBreakdownList lines={lines} total={`₹${total.toLocaleString('en-IN')}`} />

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