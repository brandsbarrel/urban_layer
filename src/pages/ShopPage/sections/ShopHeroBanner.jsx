import { shopHeroBanner } from '../../../services/shopPageData';
import styles from './ShopHeroBanner.module.css';

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