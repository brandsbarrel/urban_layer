import { useSelector } from 'react-redux';
import { MdShoppingCart, MdConfirmationNumber } from 'react-icons/md';
import StatBentoCard from '../../../components/StatBentoCard/StatBentoCard';
import { selectOrdersCount } from '../../../redux/slices/ordersSlice';
import styles from './StatsGridSection.module.css';

function StatsGridSection({ user }) {
    const ordersCount = useSelector(selectOrdersCount);

    return (
        <section className={styles.grid}>
            <StatBentoCard
                icon={MdShoppingCart}
                value={String(ordersCount).padStart(2, '0')}
                label="Total Orders"
            />
            {/* Reward stats are intentionally hidden from the profile dashboard. */}
            <StatBentoCard
                icon={MdConfirmationNumber}
                value={String(user.activeCoupons).padStart(2, '0')}
                label="Active Coupons"
            />
        </section>
    );
}

export default StatsGridSection;
