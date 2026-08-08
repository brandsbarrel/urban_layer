import { useSelector } from 'react-redux';
import OrderStatCard from '../../../components/OrderStatCard/OrderStatCard';
import { selectAuth } from '../../../redux/slices/authSlice';
import styles from './OrdersHeaderSection.module.css';

function OrdersHeaderSection({ totalCount, pendingCount }) {
    const { user } = useSelector(selectAuth);

    return (
        <section className={styles.section}>
            <div>
                <h1 className={styles.heading}>My Orders</h1>
                <p className={styles.subtitle}>
                    Review and track your Urban Layers Co. acquisitions. Experience the timeline of
                    craftsmanship from our atelier to your door.
                </p>
            </div>
            <div className={styles.stats}>
                <OrderStatCard label="Total" value={totalCount} />
                <OrderStatCard label="Pending" value={pendingCount} accent="secondary" />
                <OrderStatCard label="Rewards" value={(user?.rewardPoints ?? 0).toLocaleString('en-IN')} />
            </div>
        </section>
    );
}

export default OrdersHeaderSection;