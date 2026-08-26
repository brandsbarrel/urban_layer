import HeroSection from './sections/HeroSection';
import ShopByDeviceSection from './sections/ShopByDeviceSection';
import CollectionsSection from './sections/CollectionsSection';
import BestSellersSection from './sections/BestSellersSection';
import WhyChooseSection from './sections/WhyChooseSection';
import LifestyleBanner from './sections/LifestyleBanner';
import FeatureBannerSection from './sections/FeatureBannerSection';
import styles from './HomePage.module.css';

function HomePage() {
    return (
        <div className={styles.page}>
            <HeroSection />
            <ShopByDeviceSection />
            <CollectionsSection />
            <BestSellersSection />
            <FeatureBannerSection />
            <WhyChooseSection />
            <LifestyleBanner />
        </div>
    );
}

export default HomePage;
