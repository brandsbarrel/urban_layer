import styles from './ShopHeroBanner.module.css';

const shopHeroBanner = {
    image:
        'https://lh3.googleusercontent.com/aida/AP1WRLt7thBJUn8X6xSBCAvjxy4IJvwBx0SM83TnjRqBHMRNdvP5jZZNsvX_g82m_ChXvNN_wo10myMuiOf52R5QqgKsOTI-v6KaWiwOkIt02zL31nAXUvBApi4WmleL4Ym-__KMzDEL0mPkSjCHOHT-5d4lWX_d7xd8Er_lKMBBBmrY1BhLG1DeK6HDJZ7zDaSJxEBSHcfXoe_JINtKBI05zLeemHVe9VjIFiDVDfHCGqiuidpWLBkQGqDe9zI',
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
