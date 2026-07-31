import FullBleedHero from '../../../components/FullBleedHero/FullBleedHero';
import { collectionsHeroImage } from '../../../services/collectionsPageData';

function CollectionsHero() {
    const scrollToCollections = () => {
        document.getElementById('featured-collections')?.scrollIntoView({ behavior: 'smooth' });
    };

    return (
        <FullBleedHero
            image={collectionsHeroImage}
            imageAlt="Premium leather and carbon fiber phone cases"
            align="center"
            overlay="flat"
            heading="Find Your Perfect Collection"
            primaryAction={{ label: 'Explore Collections', onClick: scrollToCollections }}
            secondaryAction={{ label: 'Shop Best Sellers', to: '/shop' }}
        />
    );
}

export default CollectionsHero;