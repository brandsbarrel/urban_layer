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
import styles from './CheckoutPage.module.css';

function CheckoutPage() {
    const dispatch = useDispatch();
    const { user } = useSelector(selectAuth);

    const [contactInfo, setContactInfo] = useState({
        email: user?.email || '',
        phone: user?.phone || '',
    });
    const [address, setAddress] = useState({
        fullName: user?.name || '',
        street: user?.address?.line1 || '',
        city: user?.address?.city || '',
        state: user?.address?.state || '',
        pinCode: user?.address?.postalCode || '',
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
            setAddress(prev => ({
                fullName: prev.fullName || user.name || '',
                street: prev.street || user.addresses?.[0]?.line1 || '',
                city: prev.city || user.addresses?.[0]?.city || '',
                state: prev.state || user.addresses?.[0]?.state || '',
                pinCode: prev.pinCode || user.addresses?.[0]?.postalCode || '',
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
                        <ShippingAddressSection address={address} onChange={setAddress} />
                        <DeliveryMethodSection selectedMethod={deliveryMethod} onSelect={setDeliveryMethod} />
                        <PaymentMethodSection selectedMethod={paymentMethod} onSelect={setPaymentMethod} />
                    </div>

                    <CheckoutOrderSummary
                        selectedMethod={deliveryMethod}
                        paymentMethod={paymentMethod}
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