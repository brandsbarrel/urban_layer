import { MdFavorite } from 'react-icons/md';
import Breadcrumb from '../../../components/Breadcrumb/Breadcrumb';
import WishlistStatCard from '../../../components/WishlistStatCard/WishlistStatCard';
import styles from './WishlistHeader.module.css';

function WishlistHeader({ savedCount, availableCount, totalValue }) {
    return (
        <section className={styles.section}>
            <Breadcrumb items={[{ label: 'Home', path: '/' }, { label: 'Wishlist' }]} />
            <div className={styles.headerRow}>
                <div>
                    <h1 className={styles.heading}>
                        My Wishlist <MdFavorite size={32} className={styles.headingIcon} />
                    </h1>
                    <p className={styles.subtitle}>
                        Save your favorite products and purchase them whenever you're ready.
                    </p>
                </div>
                <div className={styles.statsRow}>
                    <WishlistStatCard label="Saved Items" value={`${savedCount} Items`} />
                    <WishlistStatCard label="Available Now" value={`${availableCount} Items`} />
                    <WishlistStatCard label="Total Value" value={`₹${totalValue.toLocaleString('en-IN')}`} />
                </div>
            </div>
        </section>
    );
}

export default WishlistHeader;