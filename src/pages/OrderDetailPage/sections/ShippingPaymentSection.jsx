import { MdLocationOn, MdPayments } from 'react-icons/md';
import InfoDetailCard from '../../../components/InfoDetailCard/InfoDetailCard';
import styles from './ShippingPaymentSection.module.css';

function ShippingPaymentSection({ shippingAddress, trackingNumber, hasTracking }) {
    const hasAddress = Boolean(shippingAddress?.fullName);

    return (
        <div className={styles.grid}>
            <InfoDetailCard icon={MdLocationOn} title="Shipping Address">
                {hasAddress ? (
                    <p className={styles.addressText}>
                        <span className={styles.addressName}>{shippingAddress.fullName}</span>
                        <br />
                        {shippingAddress.street}
                        <br />
                        {shippingAddress.city}, {shippingAddress.state} {shippingAddress.pinCode}
                        <br />
                        India
                    </p>
                ) : (
                    <p className={styles.addressText}>No shipping address on file for this order.</p>
                )}
            </InfoDetailCard>

            <InfoDetailCard icon={MdPayments} title="Payment Method">
                <p className={styles.paymentText}>Secure Checkout</p>
                <div className={styles.trackingBlock}>
                    <p className={styles.trackingLabel}>Tracking Number</p>
                    <p className={styles.trackingValue}>
                        {hasTracking ? trackingNumber : 'Assigned once shipped'}
                    </p>
                </div>
            </InfoDetailCard>
        </div>
    );
}

export default ShippingPaymentSection;