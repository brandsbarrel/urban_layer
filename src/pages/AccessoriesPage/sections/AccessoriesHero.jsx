import FullBleedHero from '../../../components/FullBleedHero/FullBleedHero';
import { accessoriesHeroImage } from '../../../services/accessoriesPageData';

function AccessoriesHero() {
    const scrollToProducts = () => {
        document.getElementById('accessories-grid')?.scrollIntoView({ behavior: 'smooth' });
    };

    return (
        <FullBleedHero
            image={accessoriesHeroImage}
            imageAlt="Luxury desk setup with MagSafe wallet, charger, and braided cable"
            align="left"
            overlay="gradient"
            eyebrow="Elevate Your Everyday"
            heading="Complete Your Setup"
            subtitle="Premium accessories designed for style, performance, and everyday convenience."
            primaryAction={{ label: 'Shop Accessories', onClick: scrollToProducts }}
            secondaryAction={{ label: 'Explore Best Sellers', to: '/shop' }}
        />
    );
}

export default AccessoriesHero;