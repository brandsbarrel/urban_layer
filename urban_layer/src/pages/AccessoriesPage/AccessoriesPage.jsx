import { useMemo, useState } from 'react';
import AccessoriesHero from './sections/AccessoriesHero';
import ShopByCategorySection from './sections/ShopByCategorySection';
import AccessoriesFilterSidebar from './sections/AccessoriesFilterSidebar';
import AccessoriesProductGrid from './sections/AccessoriesProductGrid';
import BundleOffersSection from './sections/BundleOffersSection';
import CompatibilityGuideSection from './sections/CompatibilityGuideSection';
import PressBannerSection from './sections/PressBannerSection';
import CommunityReviewsSection from './sections/CommunityReviewsSection';
import InstagramNewsletterSection from './sections/InstagramNewsletterSection';
import { accessoryProducts, accessoryPriceRange } from '../../services/accessoriesPageData';
import styles from './AccessoriesPage.module.css';

function AccessoriesPage() {
    const [filters, setFilters] = useState({
        search: '',
        device: 'apple',
        color: null,
        maxPrice: accessoryPriceRange.max,
    });
    const [sortBy, setSortBy] = useState('newest');

    const filteredProducts = useMemo(() => {
        let result = accessoryProducts.filter((product) => {
            const matchesSearch =
                !filters.search || product.name.toLowerCase().includes(filters.search.toLowerCase());
            const matchesDevice =
                !filters.device || filters.device === 'universal'
                    ? true
                    : product.device === filters.device || product.device === 'universal';
            const matchesColor = !filters.color || product.color === filters.color;
            const matchesPrice = product.price <= filters.maxPrice;
            return matchesSearch && matchesDevice && matchesColor && matchesPrice;
        });

        if (sortBy === 'price-low') result = [...result].sort((a, b) => a.price - b.price);
        if (sortBy === 'price-high') result = [...result].sort((a, b) => b.price - a.price);
        if (sortBy === 'best-selling') result = [...result].sort((a, b) => b.rating - a.rating);

        return result;
    }, [filters, sortBy]);

    return (
        <div className={styles.page}>
            <AccessoriesHero />
            <ShopByCategorySection />

            <section className={styles.filterSection}>
                <div className={styles.filterGrid}>
                    <AccessoriesFilterSidebar filters={filters} onFilterChange={setFilters} />
                    <AccessoriesProductGrid
                        products={filteredProducts}
                        sortBy={sortBy}
                        onSortChange={setSortBy}
                    />
                </div>
            </section>

            <BundleOffersSection />
            <CompatibilityGuideSection />
            <PressBannerSection />
            <CommunityReviewsSection />
            <InstagramNewsletterSection />
        </div>
    );
}

export default AccessoriesPage;