import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Breadcrumb from '../../components/Breadcrumb/Breadcrumb';
import OrderDetailHeaderCard from '../../components/OrderDetailHeaderCard/OrderDetailHeaderCard';
import TrackingPreviewCard from '../../components/TrackingPreviewCard/TrackingPreviewCard';
import InvoiceSupportActions from '../../components/InvoiceSupportActions/InvoiceSupportActions';
import ProductsListSection from './sections/ProductsListSection';
import ShippingPaymentSection from './sections/ShippingPaymentSection';
import CompleteCollectionSection from './sections/CompleteCollectionSection';
import DeliveryProgressCard from './sections/DeliveryProgressCard';
import { selectOrders } from '../../redux/slices/ordersSlice';
import { trackingMapImage } from '../../services/orderDetailData';
import {
    getOrderStatusLabel,
    generateTrackingNumber,
    buildOrderProgressSteps,
    formatOrderDate,
} from '../../utils/orderHelpers';
import styles from './OrderDetailPage.module.css';

function OrderDetailPage() {
    const { orderId } = useParams();
    const orders = useSelector(selectOrders);
    const order = orders.find((o) => o.id.toLowerCase() === orderId?.toLowerCase());

    if (!order) {
        return (
            <div className={styles.notFound}>
                <h1 className={styles.notFoundHeading}>Order Not Found</h1>
                <p className={styles.notFoundText}>
                    We couldn't find this order. It may have been removed or the link is incorrect.
                </p>
            </div>
        );
    }

    const hasTracking = order.status === 'shipped' || order.status === 'delivered';
    const progressSteps = buildOrderProgressSteps(order);
    const trackingLocation =
        order.status === 'shipped'
            ? 'Currently in: Regional Distribution Hub'
            : order.status === 'delivered'
                ? 'Delivered to your address'
                : 'Preparing your order';

    return (
        <div className={styles.content}>
            <Breadcrumb
                items={[
                    { label: 'Home', path: '/' },
                    { label: 'My Account', path: '/account' },
                    { label: 'My Orders', path: '/account/orders' },
                    { label: `Order #${order.id}` },
                ]}
            />

            <OrderDetailHeaderCard
                orderId={order.id}
                placedDateLabel={formatOrderDate(order.placedAt)}
                total={order.totals.total}
                statusLabel={getOrderStatusLabel(order.status)}
            />

            <div className={styles.grid}>
                <div className={styles.leftColumn}>
                    <ProductsListSection items={order.items} />
                    <ShippingPaymentSection
                        shippingAddress={order.shippingAddress}
                        trackingNumber={generateTrackingNumber(order.id)}
                        hasTracking={hasTracking}
                    />
                    <CompleteCollectionSection />
                </div>

                <div className={styles.rightColumn}>
                    <TrackingPreviewCard
                        image={trackingMapImage}
                        locationLabel={trackingLocation}
                        orderId={order.id}
                    />
                    <DeliveryProgressCard steps={progressSteps} />
                    <InvoiceSupportActions orderId={order.id} />
                </div>
            </div>
        </div>
    );
}

export default OrderDetailPage;