import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import AuthHeader from '../../components/AuthHeader/AuthHeader';
import MinimalFooter from '../../components/MinimalFooter/MinimalFooter';
import CheckoutStepper from '../../components/CheckoutStepper/CheckoutStepper';
import ContactInfoSection from './sections/ContactInfoSection';
import ShippingAddressSection from './sections/ShippingAddressSection';
import DeliveryMethodSection from './sections/DeliveryMethodSection';
import CheckoutOrderSummary from './sections/CheckoutOrderSummary';
import { selectSelectedCheckoutAddress } from '../../redux/slices/addressesSlice';
import styles from './CheckoutPage.module.css';

function CheckoutPage() {
    const selectedAddress = useSelector(selectSelectedCheckoutAddress);

    const [contactInfo, setContactInfo] = useState({ email: '', phone: '' });
    const [address, setAddress] = useState({
        fullName: '',
        street: '',
        city: '',
        state: '',
        pinCode: '',
    });
    const [deliveryMethod, setDeliveryMethod] = useState('standard');

    useEffect(() => {
        if (selectedAddress) {
            setAddress({
                fullName: selectedAddress.fullName,
                street: selectedAddress.street,
                city: selectedAddress.city,
                state: selectedAddress.state,
                pinCode: selectedAddress.pinCode,
            });
            setContactInfo((prev) => ({ ...prev, phone: selectedAddress.phone || prev.phone }));
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <div className={styles.page}>
            <AuthHeader
                variant="solid"
                backLabel="Back to Cart"
                backPath="/cart"
                brandText="Urban Layers Co."
            />

            <div className={styles.headerSpacer} />

            <CheckoutStepper currentStep={1} />

            <main className={styles.main}>
                <div className={styles.grid}>
                    <div className={styles.formColumn}>
                        <ContactInfoSection contactInfo={contactInfo} onChange={setContactInfo} />
                        <ShippingAddressSection address={address} onChange={setAddress} />
                        <DeliveryMethodSection selectedMethod={deliveryMethod} onSelect={setDeliveryMethod} />
                    </div>

                    <CheckoutOrderSummary
                        selectedMethod={deliveryMethod}
                        contactInfo={contactInfo}
                        address={address}
                    />
                </div>
            </main>

            <MinimalFooter variant="withPayment" />
        </div>
    );
}

export default CheckoutPage;