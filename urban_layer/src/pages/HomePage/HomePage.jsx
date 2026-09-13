import { useCallback, useEffect, useState } from 'react';
import {
    CategoryCardSkeleton,
    DeviceCardSkeleton,
    HeroSkeleton,
    ProductCardSkeleton,
} from '../../components/skeletons/HomeSkeletons';
import {
    getHeroSlides,
    getHomeBestSellers,
    getHomeCategories,
    getHomeDevices,
    getHomeEditorialContent,
} from '../../services/homeService';
import BestSellers from './sections/BestSellers';
import HeroSlider from './sections/HeroSlider';
import { EmptyState, SectionError } from './sections/HomeSectionStates';
import LifestyleCampaign from './sections/LifestyleCampaign';
import MaterialStory from './sections/MaterialStory';
import Newsletter from './sections/Newsletter';
import ShopByCategory from './sections/ShopByCategory';
import ShopByDevice from './sections/ShopByDevice';
import TrustStrip from './sections/TrustStrip';
import styles from './HomePage.module.css';

function useHomeSection(loader) {
    const [state, setState] = useState({
        data: null,
        loading: true,
        error: null,
    });

    const load = useCallback(async () => {
        setState((current) => ({ ...current, loading: true, error: null }));
        try {
            const data = await loader();
            setState({ data, loading: false, error: null });
        } catch {
            setState({ data: null, loading: false, error: 'Unable to load this section.' });
        }
    }, [loader]);

    useEffect(() => {
        load();
    }, [load]);

    return { ...state, retry: load };
}

function HomePage() {
    const hero = useHomeSection(getHeroSlides);
    const devices = useHomeSection(getHomeDevices);
    const categories = useHomeSection(getHomeCategories);
    const bestSellers = useHomeSection(getHomeBestSellers);
    const editorial = useHomeSection(getHomeEditorialContent);

    return (
        <div className={styles.page}>
            {hero.loading ? (
                <HeroSkeleton />
            ) : hero.error ? (
                <SectionError message="Unable to load our featured collection." onRetry={hero.retry} />
            ) : hero.data?.length ? (
                <HeroSlider slides={hero.data} />
            ) : (
                <EmptyState message="No featured collections are available right now." />
            )}

            <TrustStrip />

            <section className={styles.sectionShell}>
                {devices.loading ? (
                    <DeviceCardSkeleton />
                ) : devices.error ? (
                    <SectionError message="Unable to load device fits." onRetry={devices.retry} />
                ) : devices.data?.length ? (
                    <ShopByDevice devices={devices.data} />
                ) : (
                    <EmptyState message="No device fits are available right now." />
                )}
            </section>

            <section className={styles.sectionShell}>
                {categories.loading ? (
                    <CategoryCardSkeleton />
                ) : categories.error ? (
                    <SectionError message="Unable to load material collections." onRetry={categories.retry} />
                ) : categories.data?.length ? (
                    <ShopByCategory categories={categories.data} />
                ) : (
                    <EmptyState message="No material collections are available right now." />
                )}
            </section>

            <section className={styles.sectionShell}>
                {bestSellers.loading ? (
                    <ProductCardSkeleton />
                ) : bestSellers.error ? (
                    <SectionError message="Unable to load our best sellers." onRetry={bestSellers.retry} />
                ) : bestSellers.data?.length ? (
                    <BestSellers products={bestSellers.data} />
                ) : (
                    <EmptyState message="No products are available right now. Please check back shortly." />
                )}
            </section>

            <MaterialStory story={editorial.data?.materialStory} />
            <LifestyleCampaign banner={editorial.data?.lifestyleBanner} />
            <Newsletter />
        </div>
    );
}

export default HomePage;
