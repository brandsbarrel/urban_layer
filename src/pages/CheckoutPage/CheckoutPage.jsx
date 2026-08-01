import { useState } from 'react';
import AuthHeader from '../../components/AuthHeader/AuthHeader';
import MinimalFooter from '../../components/MinimalFooter/MinimalFooter';
import CheckoutStepper from '../../components/CheckoutStepper/CheckoutStepper';
import ContactInfoSection from './sections/ContactInfoSection';
import ShippingAddressSection from './sections/ShippingAddressSection';
import DeliveryMethodSection from './sections/DeliveryMethodSection';
import CheckoutOrderSummary from './sections/CheckoutOrderSummary';
import styles from './CheckoutPage.module.css';

function CheckoutPage() {
    const [contactInfo, setContactInfo] = useState({ email: '', phone: '' });
    const [address, setAddress] = useState({
        fullName: '',
        street: '',
        city: '',
        state: '',
        pinCode: '',
    });
    const [deliveryMethod, setDeliveryMethod] = useState('standard');

    return (
        <div className={styles.page}>
            <AuthHeader variant="solid" backLabel="Back to Cart" backPath="/cart" brandText="Urban Layers Co." />

            <div className={styles.headerSpacer} />

            <CheckoutStepper currentStep={1} />

            <main className={styles.main}>
                <div className={styles.grid}>
                    <div className={styles.formColumn}>
                        <ContactInfoSection contactInfo={contactInfo} onChange={setContactInfo} />
                        <ShippingAddressSection address={address} onChange={setAddress} />
                        <DeliveryMethodSection selectedMethod={deliveryMethod} onSelect={setDeliveryMethod} />
                    </div>

                    <CheckoutOrderSummary selectedMethod={deliveryMethod} />
                </div>
            </main>

            <MinimalFooter variant="withPayment" />
        </div>
    );
}

export default CheckoutPage;