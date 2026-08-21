import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useSearchParams } from "react-router-dom";

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

import { getCategories, getPhoneModels, getProducts } from "../../services/productsService";

function ShopPage() {
    const dispatch = useDispatch();

    const { items, meta, loading, error } = useSelector(selectProducts);

    const [searchParams] = useSearchParams();
    const initialCategory = searchParams.get("category") || "";

    const [filters, setFilters] = useState({
        search: "",
        category: initialCategory,
        phoneModel: "",
        material: "",
        color: "",
        maxPrice: 4999,
    });
    const [debouncedSearch, setDebouncedSearch] = useState("");
    const [categories, setCategories] = useState([]);
    const [phoneModels, setPhoneModels] = useState([]);

    const [sortBy, setSortBy] = useState("best-sellers");

    const [currentPage, setCurrentPage] = useState(1);

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
        filters.maxPrice,
        sortBy,
    ]);

    useEffect(() => {
        const loadInitialData = async () => {
            try {
                const [categoryList, phoneList] = await Promise.all([
                    getCategories(),
                    getPhoneModels(),
                ]);
                setCategories(categoryList || []);
                setPhoneModels(phoneList || []);
            } catch {
                setCategories([]);
                setPhoneModels([]);
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
    };

    const handleSortChange = (newSort) => {
        setSortBy(newSort);
        setCurrentPage(1);
    };

    return (
        <div className={styles.page}>
            <Breadcrumb
                items={[
                    { label: "Home", path: "/" },
                    { label: "Shop" },
                ]}
            />

            <ShopHeroBanner />

            <div className={styles.contentGrid}>
                <ShopFilterSidebar
                    filters={filters}
                    categories={categories}
                    phoneModels={phoneModels}
                    onFilterChange={handleFilterChange}
                />

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
