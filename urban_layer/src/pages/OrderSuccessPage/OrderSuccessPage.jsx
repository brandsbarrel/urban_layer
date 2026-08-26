import { useEffect } from 'react';
import { useParams, useSearchParams, useLocation, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { selectOrders, fetchOrderById } from '../../redux/slices/ordersSlice';
import { formatOrderDate } from '../../utils/orderHelpers';
import SuccessBanner from './sections/SuccessBanner';
import OrderStatusSection from './sections/OrderStatusSection';
import OrderDetailCards from './sections/OrderDetailCards';
import OrderSuccessSummary from './sections/OrderSuccessSummary';
import OrderItemsSection from './sections/OrderItemsSection';
import PostPurchaseSection from './sections/PostPurchaseSection';
import styles from './OrderSuccessPage.module.css';

function OrderSuccessPage() {
    const [searchParams] = useSearchParams();
    const { orderId } = useParams();
    const location = useLocation();
    const navOrder = location.state?.order;
    const urlOrderId = searchParams.get('orderId') || orderId || navOrder?.id || navOrder?.orderNumber || navOrder?.orderId;
    const dispatch = useDispatch();
    const orders = useSelector(selectOrders);

    // Find order in state first (Redux store has full order data after fetchOrders)
    const orderInState = orders.find(o => o.id === urlOrderId || o.orderDbId === urlOrderId || o.orderNumber === urlOrderId);
    
    // If not in state, fetch from API
    useEffect(() => {
        if (urlOrderId && !orderInState && !navOrder) {
            dispatch(fetchOrderById(urlOrderId));
        }
    }, [dispatch, urlOrderId, orderInState, navOrder]);

    // Prioritize Redux store (full order) over navOrder (minimal verification result)
    const order = orderInState || orders.find(o => o.id === urlOrderId || o.orderDbId === urlOrderId || o.orderNumber === urlOrderId) || navOrder;

    if (!order) {
        return (
            <div className={styles.notFound}>
                <h1>No Recent Order Found</h1>
                <p>Looks like you haven't placed an order yet, or this page was opened directly.</p>
                <Link to="/shop" className={styles.notFoundLink}>
                    Start Shopping
                </Link>
            </div>
        );
    }

    return (
        <div className={styles.page}>
            <SuccessBanner orderId={order.id || order.orderNumber} estimatedDelivery={order.estimatedDelivery} />

            <div className={styles.grid}>
                <div className={styles.mainColumn}>
                    <OrderStatusSection status={order.status || 'Confirmed'} confirmedDate={formatOrderDate(order.placedAt || order.createdAt || new Date())} />
                    <OrderDetailCards
                        shippingAddress={order.shippingAddress}
                        deliveryMethod={order.deliveryMethod || order.shippingMethod}
                    />
                </div>
                <div className={styles.summaryColumn}>
                    <OrderSuccessSummary order={order} />
                </div>
            </div>

            <OrderItemsSection items={order.items || []} />
            <PostPurchaseSection />
        </div>
    );
}

export default OrderSuccessPage;