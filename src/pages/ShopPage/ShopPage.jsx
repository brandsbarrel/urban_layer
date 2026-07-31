import { useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import Breadcrumb from '../../components/Breadcrumb/Breadcrumb';
import ShopHeroBanner from './sections/ShopHeroBanner';
import ShopFilterSidebar from './sections/ShopFilterSidebar';
import ProductGridSection from './sections/ProductGridSection';
import PromotionalBanner from './sections/PromotionalBanner';
import RecommendationsSlider from './sections/RecommendationsSlider';
import { shopProducts, priceFilterRange } from '../../services/shopPageData';
import styles from './ShopPage.module.css';

const PAGE_SIZE = 9;

function ShopPage() {
  const [searchParams] = useSearchParams();
  const initialMaterial = searchParams.get('material');

  const [filters, setFilters] = useState({
    search: '',
    devices: [],
    materials: initialMaterial ? [initialMaterial] : [],
    color: null,
    maxPrice: priceFilterRange.max,
  });
  const [sortBy, setSortBy] = useState('best-sellers');
  const [currentPage, setCurrentPage] = useState(1);

  const filteredProducts = useMemo(() => {
    let result = shopProducts.filter((product) => {
      const matchesSearch =
        !filters.search || product.name.toLowerCase().includes(filters.search.toLowerCase());
      const matchesDevice =
        filters.devices.length === 0 || product.device.some((d) => filters.devices.includes(d));
      const matchesMaterial =
        filters.materials.length === 0 || filters.materials.includes(product.material);
      const matchesColor = !filters.color || product.color === filters.color;
      const matchesPrice = product.price <= filters.maxPrice;
      return matchesSearch && matchesDevice && matchesMaterial && matchesColor && matchesPrice;
    });

    if (sortBy === 'price-high') result = [...result].sort((a, b) => b.price - a.price);
    if (sortBy === 'price-low') result = [...result].sort((a, b) => a.price - b.price);
    if (sortBy === 'newest') result = [...result].reverse();

    return result;
  }, [filters, sortBy]);

  const totalPages = Math.max(1, Math.ceil(filteredProducts.length / PAGE_SIZE));
  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  );

  const handleFilterChange = (nextFilters) => {
    setFilters(nextFilters);
    setCurrentPage(1);
  };

  return (
    <div className={styles.page}>
      <Breadcrumb items={[{ label: 'Home', path: '/' }, { label: 'Shop' }]} />
      <ShopHeroBanner />

      <div className={styles.contentGrid}>
        <ShopFilterSidebar filters={filters} onFilterChange={handleFilterChange} />
        <ProductGridSection
          products={paginatedProducts}
          sortBy={sortBy}
          onSortChange={setSortBy}
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      </div>

      <PromotionalBanner />
      <RecommendationsSlider />
    </div>
  );
}

export default ShopPage;