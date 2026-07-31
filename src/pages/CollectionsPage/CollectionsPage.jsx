import Breadcrumb from '../../components/Breadcrumb/Breadcrumb';
import CollectionsHero from './sections/CollectionsHero';
import FeaturedCollectionsSection from './sections/FeaturedCollectionsSection';
import ShopByMaterialSection from './sections/ShopByMaterialSection';
import CollectionSpotlightSection from './sections/CollectionSpotlightSection';
import LimitedEditionSection from './sections/LimitedEditionSection';
import CuratedJourneysSection from './sections/CuratedJourneysSection';
import LifestyleGallerySection from './sections/LifestyleGallerySection';
import BenefitsSection from './sections/BenefitsSection';
import InstagramShowcaseSection from './sections/InstagramShowcaseSection';
import styles from './CollectionsPage.module.css';

function CollectionsPage() {
    return (
        <div className={styles.page}>
            <CollectionsHero />
            <Breadcrumb items={[{ label: 'Home', path: '/' }, { label: 'Collections' }]} />
            <FeaturedCollectionsSection />
            <ShopByMaterialSection />
            <CollectionSpotlightSection />
            <LimitedEditionSection />
            <CuratedJourneysSection />
            <LifestyleGallerySection />
            <BenefitsSection />
            <InstagramShowcaseSection />
        </div>
    );
}

export default CollectionsPage;