import { useEffect } from 'react';
import {
    useParams,
    useSearchParams,
    useLocation,
    Link,
    useNavigate
} from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
    MdArrowBack,
    MdRefresh,
    MdShoppingBag,
    MdErrorOutline,
    MdHelpOutline,
    MdLocationOn,
    MdReceiptLong
} from 'react-icons/md';

import { selectOrders, fetchOrderById } from '../../redux/slices/ordersSlice';
import { formatOrderDate } from '../../utils/orderHelpers';
import styles from './OrderFailedPage.module.css';

function OrderFailedPage() {
    const [searchParams] = useSearchParams();
    const { orderId } = useParams();
    const location = useLocation();
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const navOrder = location.state?.order;
    const orders = useSelector(selectOrders);

    const urlOrderId =
        searchParams.get('orderId') ||
        orderId ||
        navOrder?.id ||
        navOrder?.orderNumber ||
        navOrder?.orderId;

    const orderInState = orders.find(
        (o) =>
            o.id === urlOrderId ||
            o.orderDbId === urlOrderId ||
            o.orderNumber === urlOrderId
    );

    useEffect(() => {
        if (urlOrderId && !orderInState && !navOrder) {
            dispatch(fetchOrderById(urlOrderId));
        }
    }, [dispatch, urlOrderId, orderInState, navOrder]);

    // Prioritize Redux store (full order) over navOrder (minimal error data)
    const order =
        orderInState ||
        orders.find(
            (o) =>
                o.id === urlOrderId ||
                o.orderDbId === urlOrderId ||
                o.orderNumber === urlOrderId
        ) || navOrder;

    const formatCurrency = (value) => {
        const amount = Number(value || 0);

        return `₹${amount.toLocaleString('en-IN')}`;
    };

    const getItemTotal = (item) => {
        if (item?.lineTotal !== undefined && item?.lineTotal !== null) {
            return Number(item.lineTotal || 0);
        }

        return (
            Number(item?.unitPrice || 0) *
            Number(item?.quantity || 0)
        );
    };

    const getFailureReason = () => {
        if (!order) {
            return null;
        }

        const paymentStatus = order.paymentStatus;
        const orderStatus = order.status;

        const timeline = Array.isArray(order.timeline)
            ? order.timeline
            : [];

        const paymentEvents = timeline.filter(
            (event) => event.source === 'payment'
        );

        const lastPaymentEvent =
            paymentEvents[paymentEvents.length - 1];

        if (lastPaymentEvent?.note) {
            return lastPaymentEvent.note;
        }

        if (paymentStatus === 'Failed') {
            if (orderStatus === 'Cancelled') {
                return 'Payment was cancelled. Your order has not been confirmed.';
            }

            return 'Your payment could not be completed. Please try again or choose a different payment method.';
        }

        if (
            paymentStatus === 'Pending' &&
            orderStatus === 'Pending'
        ) {
            return 'We could not verify your payment. Please try again.';
        }

        if (orderStatus === 'Cancelled') {
            return 'Your order was cancelled. No payment was processed.';
        }

        return 'We could not complete your order right now. Please try again.';
    };

    const getFailureTitle = () => {
        if (!order) {
            return 'Order Not Found';
        }

        const paymentStatus = order.paymentStatus;

        if (paymentStatus === 'Failed') {
            return 'Payment Failed';
        }

        if (paymentStatus === 'Pending') {
            return 'Payment Verification Failed';
        }

        if (order.status === 'Cancelled') {
            return 'Order Cancelled';
        }

        return 'Order Failed';
    };

    const canRetry = () => {
        if (!order) {
            return false;
        }

        const paymentStatus = order.paymentStatus;
        const orderStatus = order.status;

        return (
            paymentStatus === 'Failed' ||
            (paymentStatus === 'Pending' &&
                orderStatus === 'Pending')
        );
    };

    const handleRetryPayment = () => {
        if (!order) {
            return;
        }

        navigate('/checkout', {
            state: {
                retryOrderId:
                    order.id ||
                    order.orderDbId ||
                    order.orderNumber,

                retryAmount:
                    order.totalAmount ||
                    order.amount ||
                    0
            }
        });
    };

    const handleBackToCheckout = () => {
        navigate('/checkout');
    };

    const handleContinueShopping = () => {
        navigate('/shop');
    };

    if (!order) {
        return (
            <div className={styles.page}>
                <div className={styles.notFound}>
                    <MdHelpOutline
                        size={64}
                        className={styles.notFoundIcon}
                    />

                    <h1 className={styles.notFoundTitle}>
                        Order Not Found
                    </h1>

                    <p className={styles.notFoundText}>
                        We could not find an order with that ID.
                        It may have expired or the link may be incorrect.
                    </p>

                    <div className={styles.notFoundActions}>
                        <Link
                            to="/shop"
                            className={styles.primaryButton}
                        >
                            <MdShoppingBag size={18} />
                            Continue Shopping
                        </Link>

                        <Link
                            to="/cart"
                            className={styles.secondaryButton}
                        >
                            <MdArrowBack size={18} />
                            Back to Cart
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    const failureReason = getFailureReason();
    const failureTitle = getFailureTitle();
    const retryPossible = canRetry();

    const orderDisplayId =
        order.orderNumber ||
        order.id ||
        order.orderDbId ||
        urlOrderId;

    const totalAmount =
        order.totalAmount ??
        order.amount ??
        0;

    const shippingAmount =
        order.shippingAmount ??
        order.shippingCharge ??
        0;

    const subtotal = order.subtotal ?? 0;
    const taxAmount = order.taxAmount ?? 0;
    const discountAmount = order.discountAmount ?? 0;

    return (
        <div className={styles.page}>
            <div className={styles.container}>
                {/* Failure Banner */}
                <section className={styles.failureBanner}>
                    <div className={styles.iconWrapper}>
                        <MdErrorOutline
                            size={64}
                            className={styles.failureIcon}
                        />
                    </div>

                    <h1 className={styles.failureTitle}>
                        {failureTitle}
                    </h1>

                    <p className={styles.failureSubtitle}>
                        Order{' '}
                        <span className={styles.orderNumber}>
                            #{orderDisplayId}
                        </span>{' '}
                        could not be completed.
                    </p>
                </section>

                <div className={styles.detailsGrid}>
                    <div className={styles.mainColumn}>
                        {/* Payment Status */}
                        <div className={styles.detailCard}>
                            <h2 className={styles.cardTitle}>
                                Payment Status
                            </h2>

                            <div className={styles.statusRow}>
                                <div className={styles.statusItem}>
                                    <span
                                        className={styles.statusLabel}
                                    >
                                        Payment Method
                                    </span>

                                    <span
                                        className={styles.statusValue}
                                    >
                                        {order.paymentMethod || 'Online'}
                                    </span>
                                </div>

                                <div className={styles.statusItem}>
                                    <span
                                        className={styles.statusLabel}
                                    >
                                        Payment Status
                                    </span>

                                    <span
                                        className={`${styles.statusBadge} ${styles.paymentStatus}`}
                                    >
                                        {order.paymentStatus || 'Unknown'}
                                    </span>
                                </div>

                                <div className={styles.statusItem}>
                                    <span
                                        className={styles.statusLabel}
                                    >
                                        Order Status
                                    </span>

                                    <span
                                        className={`${styles.statusBadge} ${styles.orderStatus}`}
                                    >
                                        {order.status || 'Unknown'}
                                    </span>
                                </div>
                            </div>

                            <div className={styles.amountRow}>
                                <span className={styles.amountLabel}>
                                    Amount
                                </span>

                                <span className={styles.amountValue}>
                                    {formatCurrency(totalAmount)}
                                </span>
                            </div>
                        </div>

                        {/* Failure Reason */}
                        <div className={styles.detailCard}>
                            <h2 className={styles.cardTitle}>
                                <MdErrorOutline
                                    size={20}
                                    className={styles.reasonIcon}
                                />
                                Reason
                            </h2>

                            <p className={styles.reasonText}>
                                {failureReason}
                            </p>
                        </div>

                        {/* Order Information */}
                        <div className={styles.detailCard}>
                            <h2 className={styles.cardTitle}>
                                Order Information
                            </h2>

                            <div className={styles.infoRows}>
                                <div className={styles.infoRow}>
                                    <span className={styles.infoLabel}>
                                        Order Date
                                    </span>

                                    <span className={styles.infoValue}>
                                        {formatOrderDate(
                                            order.placedAt ||
                                                order.createdAt ||
                                                new Date()
                                        )}
                                    </span>
                                </div>

                                <div className={styles.infoRow}>
                                    <span className={styles.infoLabel}>
                                        Order Number
                                    </span>

                                    <span className={styles.infoValue}>
                                        #{orderDisplayId}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Delivery Address */}
                        {order.shippingAddress && (
                            <div className={styles.detailCard}>
                                <h2 className={styles.cardTitle}>
                                    <MdLocationOn
                                        size={20}
                                        className={styles.addressIcon}
                                    />
                                    Delivery Address
                                </h2>

                                <address className={styles.address}>
                                    <p>
                                        {order.shippingAddress.recipientName ||
                                            'Customer'}
                                    </p>

                                    {order.shippingAddress.line1 && (
                                        <p>
                                            {order.shippingAddress.line1}
                                        </p>
                                    )}

                                    {order.shippingAddress.line2 && (
                                        <p>
                                            {order.shippingAddress.line2}
                                        </p>
                                    )}

                                    <p>
                                        {order.shippingAddress.city}
                                        {order.shippingAddress.city &&
                                            order.shippingAddress.state
                                            ? ', '
                                            : ''}
                                        {order.shippingAddress.state}{' '}
                                        {order.shippingAddress.postalCode}
                                    </p>

                                    <p>
                                        {order.shippingAddress.country ||
                                            'India'}
                                    </p>
                                </address>
                            </div>
                        )}

                        {/* Ordered Items */}
                        {Array.isArray(order.items) &&
                            order.items.length > 0 && (
                                <div className={styles.detailCard}>
                                    <h2 className={styles.cardTitle}>
                                        Ordered Items
                                    </h2>

                                    <div className={styles.itemsList}>
                                        {order.items.map(
                                            (item, index) => (
                                                <div
                                                    key={
                                                        item.id ||
                                                        item.productId ||
                                                        index
                                                    }
                                                    className={
                                                        styles.itemRow
                                                    }
                                                >
                                                    <div
                                                        className={
                                                            styles.itemImage
                                                        }
                                                    >
                                                        {item.image ? (
                                                            <img
                                                                src={
                                                                    item.image
                                                                }
                                                                alt={
                                                                    item.name ||
                                                                    'Product'
                                                                }
                                                            />
                                                        ) : (
                                                            <MdShoppingBag
                                                                size={24}
                                                                className={
                                                                    styles.placeholderIcon
                                                                }
                                                            />
                                                        )}
                                                    </div>

                                                    <div
                                                        className={
                                                            styles.itemDetails
                                                        }
                                                    >
                                                        <p
                                                            className={
                                                                styles.itemName
                                                            }
                                                        >
                                                            {item.name ||
                                                                'Product'}
                                                        </p>

                                                        {item.variantLabel && (
                                                            <p
                                                                className={
                                                                    styles.itemVariant
                                                                }
                                                            >
                                                                {
                                                                    item.variantLabel
                                                                }
                                                            </p>
                                                        )}

                                                        <p
                                                            className={
                                                                styles.itemQuantity
                                                            }
                                                        >
                                                            Qty:{' '}
                                                            {Number(
                                                                item.quantity ||
                                                                    0
                                                            )}
                                                        </p>
                                                    </div>

                                                    <div
                                                        className={
                                                            styles.itemPrice
                                                        }
                                                    >
                                                        {formatCurrency(
                                                            getItemTotal(
                                                                item
                                                            )
                                                        )}
                                                    </div>
                                                </div>
                                            )
                                        )}
                                    </div>
                                </div>
                            )}
                    </div>

                    {/* Sidebar */}
                    <div className={styles.sidebarColumn}>
                        {/* Price Summary */}
                        <div className={styles.detailCard}>
                            <h2 className={styles.cardTitle}>
                                <MdReceiptLong
                                    size={20}
                                    className={styles.summaryIcon}
                                />
                                Price Summary
                            </h2>

                            <div className={styles.summaryRows}>
                                <div className={styles.summaryRow}>
                                    <span>Subtotal</span>
                                    <span>
                                        {formatCurrency(subtotal)}
                                    </span>
                                </div>

                                <div className={styles.summaryRow}>
                                    <span>Shipping Fee</span>

                                    <span>
                                        {Number(shippingAmount) === 0
                                            ? 'Free'
                                            : formatCurrency(
                                                  shippingAmount
                                              )}
                                    </span>
                                </div>

                                <div className={styles.summaryRow}>
                                    <span>Estimated Tax</span>

                                    <span>
                                        {formatCurrency(taxAmount)}
                                    </span>
                                </div>

                                {Number(discountAmount) > 0 && (
                                    <div
                                        className={styles.summaryRow}
                                        style={{
                                            color: '#10b981'
                                        }}
                                    >
                                        <span>Discount</span>

                                        <span>
                                            -
                                            {formatCurrency(
                                                discountAmount
                                            )}
                                        </span>
                                    </div>
                                )}

                                <div
                                    className={
                                        styles.summaryTotalRow
                                    }
                                >
                                    <span>Total Amount</span>

                                    <span>
                                        {formatCurrency(totalAmount)}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Actions */}
                        <div className={styles.actionsCard}>
                            {retryPossible && (
                                <button
                                    type="button"
                                    onClick={handleRetryPayment}
                                    className={styles.primaryButton}
                                    disabled={!order}
                                >
                                    <MdRefresh size={18} />
                                    Retry Payment
                                </button>
                            )}

                            <button
                                type="button"
                                onClick={handleBackToCheckout}
                                className={styles.secondaryButton}
                            >
                                <MdArrowBack size={18} />
                                Back to Checkout
                            </button>

                            <button
                                type="button"
                                onClick={handleContinueShopping}
                                className={styles.continueButton}
                            >
                                <MdShoppingBag size={18} />
                                Continue Shopping
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default OrderFailedPage;