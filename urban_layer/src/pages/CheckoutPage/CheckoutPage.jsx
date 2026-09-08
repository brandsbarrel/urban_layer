import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import AuthHeader from '../../components/AuthHeader/AuthHeader';
import MinimalFooter from '../../components/MinimalFooter/MinimalFooter';
import CheckoutStepper from '../../components/CheckoutStepper/CheckoutStepper';
import ContactInfoSection from './sections/ContactInfoSection';
import ShippingAddressSection from './sections/ShippingAddressSection';
import DeliveryMethodSection from './sections/DeliveryMethodSection';
import PaymentMethodSection from './sections/PaymentMethodSection';
import CheckoutOrderSummary from './sections/CheckoutOrderSummary';
import { selectAuth } from '../../redux/slices/authSlice';
import { fetchCart } from '../../redux/slices/cartSlice';
import { selectSelectedCheckoutAddress } from '../../redux/slices/addressesSlice';
import styles from './CheckoutPage.module.css';

function CheckoutPage() {
    const dispatch = useDispatch();
    const { user } = useSelector(selectAuth);
    const selectedAddress = useSelector(selectSelectedCheckoutAddress);

    const [contactInfo, setContactInfo] = useState({
        email: user?.email || '',
        phone: user?.phone || '',
    });
    const [deliveryMethod, setDeliveryMethod] = useState('standard');
    const [paymentMethod, setPaymentMethod] = useState('COD');

    useEffect(() => {
        dispatch(fetchCart());
        if (user) {
            setContactInfo(prev => ({
                email: prev.email || user.email || '',
                phone: prev.phone || user.phone || '',
            }));
        }
    }, [dispatch, user]);

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
                        <ShippingAddressSection />
                        <DeliveryMethodSection selectedMethod={deliveryMethod} onSelect={setDeliveryMethod} />
                        <PaymentMethodSection selectedMethod={paymentMethod} onSelect={setPaymentMethod} />
                    </div>

                    <CheckoutOrderSummary
                        selectedMethod={deliveryMethod}
                        paymentMethod={paymentMethod}
                        contactInfo={contactInfo}
                        address={selectedAddress}
                    />
                </div>
            </main>

            <MinimalFooter variant="withPayment" />
        </div>
    );
}

export default CheckoutPage;
