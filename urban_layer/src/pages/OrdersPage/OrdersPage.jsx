import { useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import OrdersHeaderSection from './sections/OrdersHeaderSection';
import OrdersFilterBar from './sections/OrdersFilterBar';
import OrdersListSection from './sections/OrdersListSection';
import OrdersSidebar from './sections/OrdersSidebar';
import OrdersRecommendationsSection from './sections/OrdersRecommendationsSection';
import Breadcrumb from '../../components/Breadcrumb/Breadcrumb';
import { selectOrders } from '../../redux/slices/ordersSlice';
import styles from './OrdersPage.module.css';

function OrdersPage() {
    const orders = useSelector(selectOrders);
    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');

    const filteredOrders = useMemo(() => {
        return orders.filter((order) => {
            const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
            const query = search.toLowerCase();
            const matchesSearch =
                !query ||
                order.id.toLowerCase().includes(query) ||
                order.items.some((item) => item.name.toLowerCase().includes(query));
            return matchesStatus && matchesSearch;
        });
    }, [orders, search, statusFilter]);

    const pendingCount = orders.filter((o) => o.status !== 'delivered').length;

    return (
        <div className={styles.content}>
            <Breadcrumb
                items={[{ label: 'Home', path: '/' }, { label: 'My Account', path: '/account' }, { label: 'My Orders' }]}
            />

            <OrdersHeaderSection totalCount={orders.length} pendingCount={pendingCount} />

            <OrdersFilterBar
                search={search}
                onSearchChange={setSearch}
                statusFilter={statusFilter}
                onStatusChange={setStatusFilter}
            />

            <div className={styles.grid}>
                <div className={styles.listColumn}>
                    <OrdersListSection orders={filteredOrders} />
                </div>
                <OrdersSidebar />
            </div>

            <OrdersRecommendationsSection />
        </div>
    );
}

export default OrdersPage;