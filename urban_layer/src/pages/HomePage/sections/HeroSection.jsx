import { Link } from 'react-router-dom';
import styles from './HeroSection.module.css';

const HERO_IMAGE =
    'https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb?auto=format&fit=crop&w=1800&q=85';

function HeroSection() {
    return (
        <section className={styles.hero}>
            <div className={styles.bgLayer} style={{ backgroundImage: `url('${HERO_IMAGE}')` }} />
            <div className={styles.gradient} />
            <div className={styles.content}>
                <span className={styles.eyebrow}>The Precision Collection</span>
                <h2 className={styles.heading}>
                    Protect Your Phone.
                    <br />
                    Express Your Style.
                </h2>
                <p className={styles.subtitle}>
                    Discover premium phone cases and accessories crafted with luxury materials, modern
                    aesthetics, and unmatched protection.
                </p>
                <div className={styles.actions}>
                    <Link to="/shop" className={styles.primaryButton}>
                        Shop Now
                    </Link>
                    <Link to="/collections" className={styles.secondaryButton}>
                        Explore Collections
                    </Link>
                </div>
            </div>
        </section>
    );
}

export default HeroSection;
