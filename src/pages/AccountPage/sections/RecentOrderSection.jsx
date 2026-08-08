import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import RecentOrderCard from '../../../components/RecentOrderCard/RecentOrderCard';
import { selectMostRecentOrder } from '../../../redux/slices/ordersSlice';
import styles from './RecentOrderSection.module.css';

function RecentOrderSection() {
    const order = useSelector(selectMostRecentOrder);

    return (
        <section>
            <div className={styles.header}>
                <h2 className={styles.heading}>Recent Order</h2>
                <Link to="/account/orders" className={styles.viewAllLink}>
                    View All History
                </Link>
            </div>
            {order ? (
                <RecentOrderCard order={order} />
            ) : (
                <p className={styles.emptyState}>You haven't placed any orders yet.</p>
            )}
        </section>
    );
}

export default RecentOrderSection;