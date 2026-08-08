import { useSelector } from 'react-redux';
import { MdShoppingCart, MdFavorite, MdPayments, MdConfirmationNumber } from 'react-icons/md';
import StatBentoCard from '../../../components/StatBentoCard/StatBentoCard';
import { selectOrdersCount } from '../../../redux/slices/ordersSlice';
import { selectWishlistCount } from '../../../redux/slices/wishlistSlice';
import styles from './StatsGridSection.module.css';

function StatsGridSection({ user }) {
    const ordersCount = useSelector(selectOrdersCount);
    const wishlistCount = useSelector(selectWishlistCount);

    return (
        <section className={styles.grid}>
            <StatBentoCard
                icon={MdShoppingCart}
                value={String(ordersCount).padStart(2, '0')}
                label="Total Orders"
            />
            <StatBentoCard
                icon={MdFavorite}
                value={String(wishlistCount).padStart(2, '0')}
                label="Wishlist Items"
            />
            <StatBentoCard
                icon={MdPayments}
                value={user.rewardPoints.toLocaleString('en-IN')}
                label="Reward Points"
                accent="secondary"
            />
            <StatBentoCard
                icon={MdConfirmationNumber}
                value={String(user.activeCoupons).padStart(2, '0')}
                label="Active Coupons"
            />
        </section>
    );
}

export default StatsGridSection;