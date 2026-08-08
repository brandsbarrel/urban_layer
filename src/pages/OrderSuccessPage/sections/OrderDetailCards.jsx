import { MdLocationOn, MdCreditCard } from 'react-icons/md';
import InfoDetailCard from '../../../components/InfoDetailCard/InfoDetailCard';
import styles from './OrderDetailCards.module.css';

function OrderDetailCards({ shippingAddress, deliveryMethod }) {
    return (
        <div className={styles.grid}>
            <InfoDetailCard icon={MdLocationOn} title="Shipping Address">
                <p className={styles.addressText}>
                    {shippingAddress.fullName || 'Guest Customer'}
                    <br />
                    {shippingAddress.street}
                    <br />
                    {shippingAddress.city}, {shippingAddress.state} {shippingAddress.pinCode}
                    <br />
                    India
                </p>
            </InfoDetailCard>

            <InfoDetailCard icon={MdCreditCard} title="Order Details">
                <div className={styles.rows}>
                    <div className={styles.row}>
                        <span>Payment</span>
                        <span className={styles.value}>Secure Checkout</span>
                    </div>
                    <div className={styles.row}>
                        <span>Shipping Method</span>
                        <span className={styles.value}>
                            {deliveryMethod === 'express' ? 'Express Courier' : 'Standard Shipping'}
                        </span>
                    </div>
                </div>
            </InfoDetailCard>
        </div>
    );
}

export default OrderDetailCards;