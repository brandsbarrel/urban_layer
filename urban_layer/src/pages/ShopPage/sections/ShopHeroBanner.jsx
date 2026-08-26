import styles from './ShopHeroBanner.module.css';

const shopHeroBanner = {
    image:
        'https://images.unsplash.com/photo-1616348436168-de43ad0db179?auto=format&fit=crop&w=1800&q=85',
    heading: 'Explore Premium Phone Cases',
    subtitle: 'Find premium protection designed for your style. Engineered for the modern aesthetic.',
};

function ShopHeroBanner() {
    const scrollToGrid = () => {
        document.getElementById('product-grid')?.scrollIntoView({ behavior: 'smooth' });
    };

    return (
        <section className={styles.section}>
            <div className={styles.banner} style={{ backgroundImage: `url('${shopHeroBanner.image}')` }}>
                <div className={styles.overlay} />
                <div className={styles.content}>
                    <h1 className={styles.heading}>{shopHeroBanner.heading}</h1>
                    <p className={styles.subtitle}>{shopHeroBanner.subtitle}</p>
                    <button onClick={scrollToGrid} className={styles.ctaButton}>
                        Shop Best Sellers
                    </button>
                </div>
            </div>
        </section>
    );
}

export default ShopHeroBanner;
