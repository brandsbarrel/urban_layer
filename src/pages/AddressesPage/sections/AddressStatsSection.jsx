import { MdLocationOn, MdStar, MdInventory2 } from 'react-icons/md';
import AccountStatCard from '../../../components/AccountStatCard/AccountStatCard';
import styles from './AddressStatsSection.module.css';

function AddressStatsSection({ savedCount, defaultLabel, ordersCount }) {
    return (
        <section className={styles.section}>
            <AccountStatCard icon={MdLocationOn} label="Saved Locations" value={String(savedCount).padStart(2, '0')} />
            <AccountStatCard icon={MdStar} label="Default Address" value={defaultLabel} accent="secondary" />
            <AccountStatCard icon={MdInventory2} label="Total Deliveries" value={`${ordersCount} Orders`} />
        </section>
    );
}

export default AddressStatsSection;