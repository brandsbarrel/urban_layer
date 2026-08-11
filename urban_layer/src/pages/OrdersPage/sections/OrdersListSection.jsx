import OrderListItemCard from '../../../components/OrderListItemCard/OrderListItemCard';
import styles from './OrdersListSection.module.css';

function OrdersListSection({ orders }) {
    if (orders.length === 0) {
        return <p className={styles.emptyState}>No orders match your search or filter.</p>;
    }

    const sortedOrders = [...orders].sort((a, b) => new Date(b.placedAt) - new Date(a.placedAt));
    const deliveredOrders = sortedOrders.filter((o) => o.status === 'delivered');

    return (
        <div className={styles.list}>
            {sortedOrders.map((order) => {
                let variant = 'active';
                if (order.status === 'delivered') {
                    variant = deliveredOrders[0]?.id === order.id ? 'delivered' : 'compact';
                }
                return <OrderListItemCard key={order.id} order={order} variant={variant} />;
            })}
        </div>
    );
}

export default OrdersListSection;