import SearchFilterInput from '../../../components/SearchFilterInput/SearchFilterInput';
import CheckboxFilterGroup from '../../../components/CheckboxFilterGroup/CheckboxFilterGroup';
import PriceRangeFilter from '../../../components/PriceRangeFilter/PriceRangeFilter';
import ColorSwatchFilter from '../../../components/ColorSwatchFilter/ColorSwatchFilter';
import {
    deviceFilterOptions,
    materialFilterOptions,
    colorFilterOptions,
    priceFilterRange,
} from '../../../services/shopPageData';
import styles from './ShopFilterSidebar.module.css';

function ShopFilterSidebar({ filters, onFilterChange }) {
    const toggleDevice = (id) => {
        const next = filters.devices.includes(id)
            ? filters.devices.filter((d) => d !== id)
            : [...filters.devices, id];
        onFilterChange({ ...filters, devices: next });
    };

    const toggleMaterial = (id) => {
        const next = filters.materials.includes(id)
            ? filters.materials.filter((m) => m !== id)
            : [...filters.materials, id];
        onFilterChange({ ...filters, materials: next });
    };

    return (
        <aside className={styles.sidebar}>
            <SearchFilterInput
                value={filters.search}
                onChange={(search) => onFilterChange({ ...filters, search })}
            />

            <CheckboxFilterGroup
                title="Device"
                options={deviceFilterOptions}
                selectedIds={filters.devices}
                onToggle={toggleDevice}
            />

            <CheckboxFilterGroup
                title="Material"
                options={materialFilterOptions}
                selectedIds={filters.materials}
                onToggle={toggleMaterial}
            />

            <PriceRangeFilter
                min={priceFilterRange.min}
                max={priceFilterRange.max}
                value={filters.maxPrice}
                onChange={(maxPrice) => onFilterChange({ ...filters, maxPrice })}
            />

            <ColorSwatchFilter
                colors={colorFilterOptions}
                selectedId={filters.color}
                onSelect={(color) => onFilterChange({ ...filters, color })}
            />
        </aside>
    );
}

export default ShopFilterSidebar;