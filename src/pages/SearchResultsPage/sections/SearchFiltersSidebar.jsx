import CheckboxFilterGroup from '../../../components/CheckboxFilterGroup/CheckboxFilterGroup';
import PriceRangeFilter from '../../../components/PriceRangeFilter/PriceRangeFilter';
import {
    brandFilterOptions,
    searchMaterialOptions,
    featureFilterOptions,
    searchPriceRange,
} from '../../../services/searchResultsData';
import styles from './SearchFiltersSidebar.module.css';

function SearchFiltersSidebar({ filters, onFilterChange, onClearAll }) {
    const toggleValue = (key, id) => {
        const current = filters[key];
        const next = current.includes(id) ? current.filter((v) => v !== id) : [...current, id];
        onFilterChange({ ...filters, [key]: next });
    };

    return (
        <aside className={styles.sidebar}>
            <div className={styles.header}>
                <h3 className={styles.title}>Filters</h3>
                <button type="button" onClick={onClearAll} className={styles.clearButton}>
                    Clear All
                </button>
            </div>

            <CheckboxFilterGroup
                title="Brand"
                options={brandFilterOptions}
                selectedIds={filters.brands}
                onToggle={(id) => toggleValue('brands', id)}
            />

            <CheckboxFilterGroup
                title="Material"
                options={searchMaterialOptions}
                selectedIds={filters.materials}
                onToggle={(id) => toggleValue('materials', id)}
            />

            <PriceRangeFilter
                min={searchPriceRange.min}
                max={searchPriceRange.max}
                value={filters.maxPrice}
                onChange={(maxPrice) => onFilterChange({ ...filters, maxPrice })}
            />

            <CheckboxFilterGroup
                title="Features"
                options={featureFilterOptions}
                selectedIds={filters.features}
                onToggle={(id) => toggleValue('features', id)}
            />
        </aside>
    );
}

export default SearchFiltersSidebar;