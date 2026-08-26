import CollectionCard from '../../../components/CollectionCard/CollectionCard';
import styles from './CollectionsSection.module.css';

const homeCollections = [
    {
        image: 'https://images.unsplash.com/photo-1616348436168-de43ad0db179?auto=format&fit=crop&w=1000&q=85',
        eyebrow: 'Daily Essential',
        title: 'Slim Grip Series',
        description: 'Lightweight cases with dependable everyday protection.',
        ctaLabel: 'Shop Now',
        path: '/shop',
        height: 'compact',
    },
    {
        image: 'https://images.unsplash.com/photo-1603204077779-bed963ea7d0e?auto=format&fit=crop&w=1000&q=85',
        eyebrow: 'Premium Finish',
        title: 'Leather Touch',
        description: 'Refined texture, clean edges, and a premium hand-feel.',
        ctaLabel: 'Explore',
        path: '/collections',
        height: 'compact',
        ctaVariant: 'light',
    },
    {
        image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1000&q=85',
        eyebrow: 'MagSafe Ready',
        title: 'Snap & Charge',
        description: 'Magnetic convenience for desk, car, and bedside charging.',
        ctaLabel: 'View Cases',
        path: '/shop',
        height: 'compact',
    },
    {
        image: 'https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb?auto=format&fit=crop&w=1000&q=85',
        eyebrow: 'New Drop',
        title: 'Urban Black',
        description: 'Minimal matte covers built for a sharp everyday setup.',
        ctaLabel: 'Discover',
        path: '/collections',
        height: 'compact',
        ctaVariant: 'light',
    },
];

function CollectionsSection() {
    return (
        <section className={styles.section}>
            <div className={styles.container}>
                <h3 className={styles.heading}>Curated Collections</h3>
                <div className={styles.grid}>
                    {homeCollections.map((collection) => (
                        <CollectionCard key={collection.title} {...collection} />
                    ))}
                </div>
            </div>
        </section>
    );
}

export default CollectionsSection;
