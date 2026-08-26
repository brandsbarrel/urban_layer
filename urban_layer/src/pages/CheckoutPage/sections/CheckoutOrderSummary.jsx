import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { MdLock, MdVerified, MdSupportAgent, MdArrowForward, MdCreditCard, MdLocalShipping } from 'react-icons/md';
import OrderSummaryLineItem from '../../../components/OrderSummaryLineItem/OrderSummaryLineItem';
import PriceBreakdownList from '../../../components/PriceBreakdownList/PriceBreakdownList';
import { selectCartItems, selectCartLoading, selectCartError, checkoutCartAsync, clearCart } from '../../../redux/slices/cartSlice';
import { fetchOrders } from '../../../redux/slices/ordersSlice';
import { calculateCartTotals, EXPRESS_SHIPPING_FEE } from '../../../utils/pricing';
import { openRazorpayCheckout } from '../../../utils/razorpay';
import { paymentApi } from '../../../api/paymentApi';
import styles from './CheckoutOrderSummary.module.css';

function CheckoutOrderSummary({ selectedMethod, paymentMethod = 'COD', contactInfo, address }) {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const items = useSelector(selectCartItems);
    const loading = useSelector(selectCartLoading);
    const error = useSelector(selectCartError);
    const [localError, setLocalError] = useState(null);
    const [isProcessingPayment, setIsProcessingPayment] = useState(false);

    const shippingOverride = selectedMethod === 'express' ? EXPRESS_SHIPPING_FEE : 0;
    const { subtotal, shipping, tax, total, isFreeShipping } = calculateCartTotals(
        items,
        null,
        shippingOverride
    );

    const getPaymentIcon = (method) => {
        switch (method) {
            case 'COD': return <MdLocalShipping size={20} />;
            case 'Online': return <MdCreditCard size={20} />;
            default: return <MdArrowForward size={20} />;
        }
    };

    const handlePlaceOrder = async () => {
        setLocalError(null);
        if (items.length === 0) {
            setLocalError("Your cart is empty.");
            return;
        }
        
        if (!address?.fullName?.trim() || !address?.street?.trim() || !address?.city?.trim() || !address?.state?.trim() || !address?.pinCode?.trim()) {
            setLocalError("Please complete all shipping address fields (Full Name, Street Address, City, State, PIN Code).");
            return;
        }

        const checkoutData = {
            items: items.map(item => ({
                productId: item.id,
                quantity: item.quantity,
            })),
            shippingAddress: {
                recipientName: address.fullName.trim(),
                line1: address.street.trim(),
                city: address.city.trim(),
                state: address.state.trim(),
                postalCode: address.pinCode.trim(),
                country: 'India',
            },
            billingAddress: {
                recipientName: address.fullName.trim(),
                line1: address.street.trim(),
                city: address.city.trim(),
                state: address.state.trim(),
                postalCode: address.pinCode.trim(),
                country: 'India',
            },
            shippingMethod: selectedMethod,
            paymentMethod: paymentMethod || 'COD',
            contactEmail: contactInfo?.email || '',
            contactPhone: contactInfo?.phone || '',
        };

        try {
            setIsProcessingPayment(true);

            // For COD, checkout immediately creates Confirmed order & triggers shipment
            if (paymentMethod === 'COD') {
                const result = await dispatch(checkoutCartAsync(checkoutData)).unwrap();
                await dispatch(fetchOrders());
                navigate('/order-success', { state: { order: result } });
            } else {
                // For Online Payments (UPI, Cards, Net Banking, Wallets):
                // 1. Create Pending order & real Razorpay Order on backend
                const orderResult = await dispatch(checkoutCartAsync(checkoutData)).unwrap();
                
                // 2. Open standard Razorpay Checkout Modal
                const razorpayResponse = await openRazorpayCheckout({
                    key: orderResult.keyId || import.meta.env.VITE_RAZORPAY_KEY_ID,
                    amount: orderResult.amountPaise || Math.round(orderResult.amount * 100),
                    currency: orderResult.currency || 'INR',
                    name: 'Urban Layers Co.',
                    description: `Order #${orderResult.orderNumber}`,
                    order_id: orderResult.razorpayOrderId,
                    prefill: {
                        name: address.fullName.trim(),
                        email: contactInfo?.email || '',
                        contact: contactInfo?.phone || '',
                    },
                    theme: {
                        color: '#1a1a1a',
                    },
                });

                // 3. Verify Razorpay signature server-side
                const verificationResult = await paymentApi.verifyPayment({
                    razorpay_order_id: razorpayResponse.razorpay_order_id,
                    razorpay_payment_id: razorpayResponse.razorpay_payment_id,
                    razorpay_signature: razorpayResponse.razorpay_signature,
                    orderId: orderResult.orderId,
                });

                // 4. Payment verified & order confirmed: Clear local cart & redirect
                dispatch(clearCart());
                await dispatch(fetchOrders());
                navigate('/order-success', { state: { order: verificationResult.order || verificationResult } });
            }
        } catch (err) {
            console.error('Checkout/Payment error:', err);
            const errorMessage = err?.response?.data?.message || err.message || 'Checkout failed. Please try again.';
            setLocalError(errorMessage);
            
            // Redirect to order failed page with order info if available
            if (err?.response?.data?.orderId) {
                navigate('/order-failed', { 
                    state: { 
                        order: err.response.data,
                        error: errorMessage
                    } 
                });
            }
        } finally {
            setIsProcessingPayment(false);
        }
    };

    const lines = [
        { label: 'Subtotal', value: `₹${subtotal.toLocaleString('en-IN')}` },
        {
            label: 'Shipping',
            value: isFreeShipping ? 'Free' : `₹${shipping.toLocaleString('en-IN')}`,
            highlight: isFreeShipping,
        },
        { label: 'Estimated Tax', value: `₹${tax.toLocaleString('en-IN')}` },
    ];

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

                <PriceBreakdownList lines={lines} total={`₹${total.toLocaleString('en-IN')}`} />

                {/* Payment method indicator */}
                <div className={styles.paymentIndicator}>
                    <span className={styles.paymentLabel}>Payment: </span>
                    <span className={styles.paymentValue}>
                        {getPaymentIcon(paymentMethod)}
                        {paymentMethod === 'COD' ? 'Cash on Delivery' : paymentMethod}
                    </span>
                </div>

                <button
                    type="button"
                    onClick={handlePlaceOrder}
                    className={styles.placeOrderButton}
                    disabled={items.length === 0 || loading || isProcessingPayment}
                >
                    {isProcessingPayment ? (
                        <>
                            <span className={styles.spinner} />
                            Processing Payment...
                        </>
                    ) : (
                        <>
                            {paymentMethod === 'COD' ? 'Place Order' : 'Pay Securely'}
                            <MdArrowForward size={18} className={styles.placeOrderIcon} />
                        </>
                    )}
                </button>

                {(localError || error) && (
                    <div className={styles.errorMessage}>
                        {localError || error}
                    </div>
                )}

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