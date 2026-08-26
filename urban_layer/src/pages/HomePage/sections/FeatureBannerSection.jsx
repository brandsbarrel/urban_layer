import { Link } from 'react-router-dom';
import styles from './FeatureBannerSection.module.css';

const BANNER_IMAGE =
    'https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb?auto=format&fit=crop&w=1800&q=85';

function FeatureBannerSection() {
    return (
        <section className={styles.banner} style={{ backgroundImage: `url('${BANNER_IMAGE}')` }}>
            <div className={styles.overlay} />
            <div className={styles.content}>
                <span className={styles.eyebrow}>Limited launch offer</span>
                <h2 className={styles.heading}>Upgrade your case before the next drop sells out.</h2>
                <p className={styles.copy}>Premium textures, precise cutouts, and everyday protection for the phones you actually carry.</p>
                <Link to="/shop" className={styles.button}>Shop Cases</Link>
            </div>
        </section>
    );
}

export default FeatureBannerSection;
