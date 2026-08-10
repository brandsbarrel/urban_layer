import { MdBolt, MdAccountBalanceWallet, MdBatteryChargingFull, MdShield } from 'react-icons/md';
import CategoryImageCard from '../../../components/CategoryImageCard/CategoryImageCard';
import { accessoryCategories } from '../../../services/accessoriesPageData';
import styles from './ShopByCategorySection.module.css';

const ICON_MAP = {
    bolt: MdBolt,
    wallet: MdAccountBalanceWallet,
    battery_charging_full: MdBatteryChargingFull,
    shield: MdShield,
};

function ShopByCategorySection() {
    return (
        <section className={styles.section}>
            <div className={styles.header}>
                <h2 className={styles.heading}>Essentials for Modern Living</h2>
                <a href="#accessories-grid" className={styles.viewAllLink}>
                    View All Categories
                </a>
            </div>
            <div className={styles.grid}>
                {accessoryCategories.map((category) => (
                    <CategoryImageCard
                        key={category.id}
                        image={category.image}
                        imageAlt={category.label}
                        icon={ICON_MAP[category.icon]}
                        label={category.label}
                    />
                ))}
            </div>
        </section>
    );
}

export default ShopByCategorySection;