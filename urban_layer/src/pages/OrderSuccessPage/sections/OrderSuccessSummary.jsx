import { Link } from 'react-router-dom';
import PriceBreakdownList from '../../../components/PriceBreakdownList/PriceBreakdownList';
import styles from './OrderSuccessSummary.module.css';

function OrderSuccessSummary({ order }) {
    const { subtotal, shipping, tax, total } = order.totals;
    const isFreeShipping = shipping === 0;

    const lines = [
        {
            label: `Subtotal (${order.items.length} items)`,
            value: `₹${subtotal.toLocaleString('en-IN')}`,
        },
        {
            label: order.deliveryMethod === 'express' ? 'Express Shipping' : 'Standard Shipping',
            value: isFreeShipping ? 'Free' : `₹${shipping.toLocaleString('en-IN')}`,
            highlight: isFreeShipping,
        },
        { label: 'Tax', value: `₹${tax.toLocaleString('en-IN')}` },
    ];

    return (
        <div className={styles.card}>
            <h3 className={styles.heading}>Summary</h3>
            <PriceBreakdownList lines={lines} total={`₹${total.toLocaleString('en-IN')}`} />

            <div className={styles.actions}>
                <Link to={`/track-order?order=${order.id}`} className={styles.trackButton}>
                    Track My Order
                </Link>
                <Link to="/shop" className={styles.continueButton}>
                    Continue Shopping
                </Link>
            </div>
        </div>
    );
}

export default OrderSuccessSummary;