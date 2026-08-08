import SearchFilterInput from '../../../components/SearchFilterInput/SearchFilterInput';
import PillFilterGroup from '../../../components/PillFilterGroup/PillFilterGroup';
import { MdSearch } from 'react-icons/md';
import styles from './OrdersFilterBar.module.css';

const STATUS_OPTIONS = [
    { id: 'all', label: 'All' },
    { id: 'processing', label: 'Processing' },
    { id: 'shipped', label: 'Shipped' },
    { id: 'delivered', label: 'Delivered' },
    { id: 'returned', label: 'Returned' },
];

function OrdersFilterBar({ search, onSearchChange, statusFilter, onStatusChange }) {
    return (
        <section className={styles.section}>
            <div className={styles.searchWrapper}>
                <SearchFilterInput
                    value={search}
                    onChange={onSearchChange}
                    placeholder="Search by Order ID or Product..."
                    icon={MdSearch}
                    iconPosition="left"
                />
            </div>
            <PillFilterGroup options={STATUS_OPTIONS} selectedId={statusFilter} onSelect={onStatusChange} />
        </section>
    );
}

export default OrdersFilterBar;