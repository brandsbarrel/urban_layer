import SearchFilterInput from '../../../components/SearchFilterInput/SearchFilterInput';
import CheckboxFilterGroup from '../../../components/CheckboxFilterGroup/CheckboxFilterGroup';
import PriceRangeFilter from '../../../components/PriceRangeFilter/PriceRangeFilter';
import styles from './ShopFilterSidebar.module.css';

function FilterSkeleton() {
    return (
        <div className={styles.skeletonBlock} aria-label="Loading filters">
            <span className={styles.skeletonInput} />
            {[0, 1, 2].map((group) => (
                <div className={styles.skeletonGroup} key={group}>
                    <span className={styles.skeletonTitle} />
                    <span className={styles.skeletonOption} />
                    <span className={styles.skeletonOption} />
                    <span className={styles.skeletonOptionShort} />
                </div>
            ))}
        </div>
    );
}

function ShopFilterSidebar({ filters, categories = [], phoneModels = [], loading = false, onFilterChange }) {
    const categoryOptions = categories.map((category) => ({
        id: category.slug || category.id,
        label: category.name,
    }));

    // Collect all unique phone models dynamically from API models and category models.
    const apiPhoneNames = (phoneModels || []).map((pm) =>
        typeof pm === 'string' ? pm : pm.name || pm.label || pm.id
    );
    const categoryPhoneNames = categories.flatMap((cat) => cat.phoneModels || []);

    const allPhoneNames = Array.from(
        new Set([...apiPhoneNames, ...categoryPhoneNames])
    );

    // Dynamically filter available phone models if a category is currently selected
    let activePhoneModels = allPhoneNames;
    if (filters.category) {
        const selectedCat = categories.find(
            (cat) => cat.slug === filters.category || cat.id === filters.category
        );
        if (selectedCat && Array.isArray(selectedCat.phoneModels) && selectedCat.phoneModels.length > 0) {
            const catModelsSet = new Set(selectedCat.phoneModels);
            const filteredModels = allPhoneNames.filter((model) => catModelsSet.has(model));
            if (filteredModels.length > 0) {
                activePhoneModels = filteredModels;
            }
        }
    }

    const phoneOptions = activePhoneModels.map((model) => ({
        id: model,
        label: model,
    }));

    const toggleCategory = (id) => {
        onFilterChange({
            ...filters,
            category: filters.category === id ? '' : id,
        });
    };

    const togglePhoneModel = (id) => {
        onFilterChange({
            ...filters,
            phoneModel: filters.phoneModel === id ? '' : id,
        });
    };

    const handlePriceChange = (newMax) => {
        onFilterChange({
            ...filters,
            maxPrice: newMax,
        });
    };

    const hasActiveFilters =
        Boolean(filters.search) ||
        Boolean(filters.category) ||
        Boolean(filters.phoneModel) ||
        (filters.maxPrice && filters.maxPrice < 4999);

    const handleClearAll = () => {
        onFilterChange({
            search: '',
            category: '',
            phoneModel: '',
            material: '',
            color: '',
            maxPrice: 4999,
        });
    };

    return (
        <aside className={styles.sidebar}>
            <div className={styles.headerRow}>
                <h2 className={styles.filterTitle}>Filters</h2>
                {hasActiveFilters && (
                    <button type="button" onClick={handleClearAll} className={styles.clearButton}>
                        Reset All
                    </button>
                )}
            </div>

            <SearchFilterInput
                value={filters.search}
                onChange={(search) => onFilterChange({ ...filters, search })}
            />

            {loading ? (
                <FilterSkeleton />
            ) : (
                <>
            <PriceRangeFilter
                min={499}
                max={4999}
                value={filters.maxPrice || 4999}
                onChange={handlePriceChange}
            />

            <CheckboxFilterGroup
                title="Device Model"
                options={phoneOptions}
                selectedIds={filters.phoneModel ? [filters.phoneModel] : []}
                onToggle={togglePhoneModel}
            />

            <CheckboxFilterGroup
                title="Category"
                options={categoryOptions}
                selectedIds={filters.category ? [filters.category] : []}
                onToggle={toggleCategory}
            />
                </>
            )}
        </aside>
    );
}

export default ShopFilterSidebar;
