import { Link } from 'react-router-dom';
import styles from './AboutClosingBanner.module.css';

const BANNER_IMAGE =
    'https://images.unsplash.com/photo-1603204077779-bed963ea7d0e?auto=format&fit=crop&w=1800&q=85';

function AboutClosingBanner() {
    return (
        <section className={styles.banner} style={{ backgroundImage: `url('${BANNER_IMAGE}')` }}>
            <div className={styles.overlay} />
            <div className={styles.content}>
                <span className={styles.eyebrow}>Built for everyday carry</span>
                <h2 className={styles.heading}>Choose protection that looks as refined as it feels.</h2>
                <Link to="/shop" className={styles.button}>Shop The Collection</Link>
            </div>
        </section>
    );
}

export default AboutClosingBanner;
