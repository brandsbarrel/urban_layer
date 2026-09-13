import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useSearchParams } from "react-router-dom";
import { MdClose, MdTune } from "react-icons/md";

import Breadcrumb from "../../components/Breadcrumb/Breadcrumb";

import ShopHeroBanner from "./sections/ShopHeroBanner";
import ShopFilterSidebar from "./sections/ShopFilterSidebar";
import ProductGridSection from "./sections/ProductGridSection";
import PromotionalBanner from "./sections/PromotionalBanner";
import RecommendationsSlider from "./sections/RecommendationsSlider";

import styles from "./ShopPage.module.css";

import {
    fetchProductsStart,
    fetchProductsSuccess,
    fetchProductsFailure,
    selectProducts,
} from "../../redux/slices/productSlice";

import { getCategories, getPhoneModels, getProducts, slugifyValue } from "../../services/productsService";

const DEFAULT_MAX_PRICE = 4999;

const getFiltersFromSearchParams = (searchParams) => ({
    search: searchParams.get("search") || searchParams.get("q") || "",
    category: searchParams.get("category") || "",
    phoneModel: searchParams.get("phoneModel") || searchParams.get("device") || "",
    material: searchParams.get("material") || "",
    color: searchParams.get("color") || "",
    maxPrice: Number(searchParams.get("maxPrice") || DEFAULT_MAX_PRICE),
});

const buildMaterialOptions = (products = []) => {
    const options = new Map();
    products.forEach((product) => {
        const label = product.collection || product.material || "";
        const id = slugifyValue(product.material || product.collection || "");
        if (id && label && !options.has(id)) {
            options.set(id, { id, label });
        }
    });
    return Array.from(options.values());
};

function ShopPage() {
    const dispatch = useDispatch();

    const { items, meta, loading, error } = useSelector(selectProducts);

    const [searchParams, setSearchParams] = useSearchParams();

    const [filters, setFilters] = useState(() => getFiltersFromSearchParams(searchParams));
    const [debouncedSearch, setDebouncedSearch] = useState("");
    const [categories, setCategories] = useState([]);
    const [phoneModels, setPhoneModels] = useState([]);
    const [materialOptions, setMaterialOptions] = useState([]);
    const [filtersLoading, setFiltersLoading] = useState(true);

    const [sortBy, setSortBy] = useState("all");
    const [isFilterOpen, setIsFilterOpen] = useState(false);

    const [currentPage, setCurrentPage] = useState(1);

    const searchParamsKey = useMemo(() => searchParams.toString(), [searchParams]);

    useEffect(() => {
        setFilters(getFiltersFromSearchParams(searchParams));
        setCurrentPage(1);
    }, [searchParamsKey]);

    useEffect(() => {
        const timer = window.setTimeout(() => {
            setDebouncedSearch(filters.search);
            setCurrentPage(1);
        }, 300);

        return () => window.clearTimeout(timer);
    }, [filters.search]);

    useEffect(() => {
        loadProducts();
    }, [
        currentPage,
        debouncedSearch,
        filters.category,
        filters.phoneModel,
        filters.material,
        filters.maxPrice,
        sortBy,
    ]);

    useEffect(() => {
        const loadInitialData = async () => {
            setFiltersLoading(true);
            try {
                const [categoryList, phoneList, catalogResponse] = await Promise.all([
                    getCategories(),
                    getPhoneModels(),
                    getProducts({ page: 1, perPage: 100, sortBy: "newest", maxPrice: null }),
                ]);
                setCategories(categoryList || []);
                setPhoneModels(phoneList || []);
                setMaterialOptions(buildMaterialOptions(catalogResponse?.data?.items || []));
            } catch {
                setCategories([]);
                setPhoneModels([]);
                setMaterialOptions([]);
            } finally {
                setFiltersLoading(false);
            }
        };

        loadInitialData();
    }, []);

    const loadProducts = async () => {
        dispatch(fetchProductsStart());

        try {
            const response = await getProducts({
                page: currentPage,
                perPage: 9,
                search: debouncedSearch,
                category: filters.category,
                phoneModel: filters.phoneModel,
                material: filters.material,
                color: filters.color,
                maxPrice: filters.maxPrice,
                sortBy: sortBy,
            });

            dispatch(fetchProductsSuccess(response));
        } catch (err) {
            dispatch(fetchProductsFailure(err.message || "Failed to load products."));
        }
    };

    const handleFilterChange = (nextFilters) => {
        setFilters(nextFilters);
        setCurrentPage(1);
        const nextParams = {};
        if (nextFilters.search) nextParams.search = nextFilters.search;
        if (nextFilters.category) nextParams.category = nextFilters.category;
        if (nextFilters.phoneModel) nextParams.phoneModel = nextFilters.phoneModel;
        if (nextFilters.material) nextParams.material = nextFilters.material;
        if (nextFilters.color) nextParams.color = nextFilters.color;
        if (nextFilters.maxPrice && nextFilters.maxPrice < DEFAULT_MAX_PRICE) {
            nextParams.maxPrice = String(nextFilters.maxPrice);
        }
        setSearchParams(nextParams, { replace: true });
    };

    const handleSortChange = (newSort) => {
        setSortBy(newSort);
        setCurrentPage(1);
    };

    const activeFilterCount = [
        filters.search,
        filters.category,
        filters.phoneModel,
        filters.material,
        filters.color,
        filters.maxPrice && filters.maxPrice < DEFAULT_MAX_PRICE ? filters.maxPrice : '',
    ].filter(Boolean).length;

    return (
        <div className={styles.page}>
            <Breadcrumb
                items={[
                    { label: "Home", path: "/" },
                    { label: "Shop" },
                ]}
            />

            <ShopHeroBanner />

            <div className={styles.mobileFilterBar}>
                <button type="button" className={styles.filterToggle} onClick={() => setIsFilterOpen(true)}>
                    <MdTune size={20} />
                    <span>Filters</span>
                    {activeFilterCount > 0 && <strong>{activeFilterCount}</strong>}
                </button>
            </div>

            <div className={styles.contentGrid}>
                <div className={`${styles.filterPanel} ${isFilterOpen ? styles.filterPanelOpen : ''}`}>
                    <div className={styles.filterPanelHeader}>
                        <h2 className={styles.filterPanelTitle}>Filters</h2>
                        <button type="button" onClick={() => setIsFilterOpen(false)} aria-label="Close filters">
                            <MdClose size={22} />
                        </button>
                    </div>
                    <ShopFilterSidebar
                        filters={filters}
                        categories={categories}
                        phoneModels={phoneModels}
                        materialOptions={materialOptions}
                        loading={filtersLoading}
                        onFilterChange={handleFilterChange}
                    />
                    <button type="button" className={styles.applyFiltersButton} onClick={() => setIsFilterOpen(false)}>
                        Apply Filters
                    </button>
                </div>
                {isFilterOpen && <button type="button" className={styles.filterBackdrop} onClick={() => setIsFilterOpen(false)} aria-label="Close filters" />}

                <ProductGridSection
                    products={items || []}
                    loading={loading}
                    sortBy={sortBy}
                    onSortChange={handleSortChange}
                    currentPage={currentPage}
                    totalPages={meta?.totalPages || 1}
                    totalItems={meta?.totalItems || (items ? items.length : 0)}
                    error={error}
                    onPageChange={setCurrentPage}
                />
            </div>

            <PromotionalBanner />

            <RecommendationsSlider />
        </div>
    );
}

export default ShopPage;
