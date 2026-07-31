import HeroSection from './sections/HeroSection';
import ShopByDeviceSection from './sections/ShopByDeviceSection';
import CollectionsSection from './sections/CollectionsSection';
import BestSellersSection from './sections/BestSellersSection';
import WhyChooseSection from './sections/WhyChooseSection';
import LifestyleBanner from './sections/LifestyleBanner';
import styles from './HomePage.module.css';

function HomePage() {
    return (
        <div className={styles.page}>
            <HeroSection />
            <ShopByDeviceSection />
            <CollectionsSection />
            <BestSellersSection />
            <WhyChooseSection />
            <LifestyleBanner />
        </div>
    );
}

export default HomePage;