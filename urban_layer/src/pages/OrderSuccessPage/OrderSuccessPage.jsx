import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { selectLastOrder } from '../../redux/slices/ordersSlice';
import { formatOrderDate } from '../../utils/orderHelpers';
import SuccessBanner from './sections/SuccessBanner';
import OrderStatusSection from './sections/OrderStatusSection';
import OrderDetailCards from './sections/OrderDetailCards';
import OrderSuccessSummary from './sections/OrderSuccessSummary';
import OrderItemsSection from './sections/OrderItemsSection';
import PostPurchaseSection from './sections/PostPurchaseSection';
import styles from './OrderSuccessPage.module.css';

function OrderSuccessPage() {
    const order = useSelector(selectLastOrder);

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
            <SuccessBanner orderId={order.id} estimatedDelivery={order.estimatedDelivery} />

            <div className={styles.grid}>
                <div className={styles.mainColumn}>
                    <OrderStatusSection status={order.status} confirmedDate={formatOrderDate(order.placedAt)} />
                    <OrderDetailCards
                        shippingAddress={order.shippingAddress}
                        deliveryMethod={order.deliveryMethod}
                    />
                </div>
                <div className={styles.summaryColumn}>
                    <OrderSuccessSummary order={order} />
                </div>
            </div>

            <OrderItemsSection items={order.items} />
            <PostPurchaseSection />
        </div>
    );
}

export default OrderSuccessPage;