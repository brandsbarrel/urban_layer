import SearchFilterInput from '../../../components/SearchFilterInput/SearchFilterInput';
import PillFilterGroup from '../../../components/PillFilterGroup/PillFilterGroup';
import PriceRangeFilter from '../../../components/PriceRangeFilter/PriceRangeFilter';
import ColorSwatchFilter from '../../../components/ColorSwatchFilter/ColorSwatchFilter';
import { MdSearch } from 'react-icons/md';
import {
    deviceCompatibilityOptions,
    accessoryColorOptions,
    accessoryPriceRange,
} from '../../../services/accessoriesPageData';
import styles from './AccessoriesFilterSidebar.module.css';

function AccessoriesFilterSidebar({ filters, onFilterChange }) {
    return (
        <aside className={styles.sidebar}>
            <div className={styles.card}>
                <div className={styles.searchWrapper}>
                    <SearchFilterInput
                        value={filters.search}
                        onChange={(search) => onFilterChange({ ...filters, search })}
                        placeholder="Find accessory..."
                        icon={MdSearch}
                        iconPosition="left"
                    />
                </div>

                <div className={styles.filterGroups}>
                    <PillFilterGroup
                        title="Device compatibility"
                        options={deviceCompatibilityOptions}
                        selectedId={filters.device}
                        onSelect={(device) => onFilterChange({ ...filters, device })}
                    />

                    <PriceRangeFilter
                        min={accessoryPriceRange.min}
                        max={accessoryPriceRange.max}
                        value={filters.maxPrice}
                        onChange={(maxPrice) => onFilterChange({ ...filters, maxPrice })}
                    />

                    <ColorSwatchFilter
                        title="Color Palette"
                        colors={accessoryColorOptions}
                        selectedId={filters.color}
                        onSelect={(color) => onFilterChange({ ...filters, color })}
                        size="sm"
                    />
                </div>
            </div>
        </aside>
    );
}

export default AccessoriesFilterSidebar;