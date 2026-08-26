import FullBleedHero from '../../../components/FullBleedHero/FullBleedHero';
const collectionsHeroImage =
    'https://images.unsplash.com/photo-1603204077779-bed963ea7d0e?auto=format&fit=crop&w=1800&q=85';

function CollectionsHero() {
    const scrollToCollections = () => {
        document.getElementById('featured-collections')?.scrollIntoView({ behavior: 'smooth' });
    };

    return (
        <FullBleedHero
            image={collectionsHeroImage}
            imageAlt="Premium leather and carbon fiber phone cases"
            align="left"
            overlay="gradient"
            eyebrow="Signature Collections"
            heading="Find Your Perfect Collection"
            subtitle="Explore slim everyday cases, premium leather textures, MagSafe-ready designs, and statement covers made for daily protection."
            primaryAction={{ label: 'Explore Collections', onClick: scrollToCollections }}
            secondaryAction={{ label: 'Shop Best Sellers', to: '/shop' }}
        />
    );
}

export default CollectionsHero;
