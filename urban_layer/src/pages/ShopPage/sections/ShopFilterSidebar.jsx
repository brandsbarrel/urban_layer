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

function ShopFilterSidebar({ filters, categories = [], phoneModels = [], materialOptions = [], loading = false, onFilterChange }) {
    const categoryOptions = categories.map((category) => ({
        id: category.slug || category.id,
        label: category.name,
    }));

    const phoneOptions = (phoneModels || []).map((model) => ({
        id: typeof model === 'string' ? model : model.slug || model.id || model.name,
        label: typeof model === 'string' ? model : model.label || model.name,
    }));

    // Dynamically filter available phone models if a category is currently selected
    let activePhoneOptions = phoneOptions;
    if (filters.category) {
        const selectedCat = categories.find(
            (cat) => cat.slug === filters.category || cat.id === filters.category
        );
        if (selectedCat && Array.isArray(selectedCat.phoneModels) && selectedCat.phoneModels.length > 0) {
            const catModelsSet = new Set(selectedCat.phoneModels.map((item) => String(item).toLowerCase()));
            const filteredModels = phoneOptions.filter((model) =>
                catModelsSet.has(String(model.id).toLowerCase()) ||
                catModelsSet.has(String(model.label).toLowerCase())
            );
            if (filteredModels.length > 0) {
                activePhoneOptions = filteredModels;
            }
        }
    }

    const toggleCategory = (id) => {
        onFilterChange({
            ...filters,
            category: filters.category === id ? '' : id,
        });
    };

    const toggleMaterial = (id) => {
        onFilterChange({
            ...filters,
            material: filters.material === id ? '' : id,
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
        Boolean(filters.material) ||
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
                        options={activePhoneOptions}
                        selectedIds={filters.phoneModel ? [filters.phoneModel] : []}
                        onToggle={togglePhoneModel}
                    />

                    {materialOptions.length > 0 && (
                        <CheckboxFilterGroup
                            title="Material"
                            options={materialOptions}
                            selectedIds={filters.material ? [filters.material] : []}
                            onToggle={toggleMaterial}
                        />
                    )}

                    <CheckboxFilterGroup
                        title="Collections"
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
