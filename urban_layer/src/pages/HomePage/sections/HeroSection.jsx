import { Link } from 'react-router-dom';
import styles from './HeroSection.module.css';

const HERO_IMAGE =
    'https://lh3.googleusercontent.com/aida/AP1WRLt7thBJUn8X6xSBCAvjxy4IJvwBx0SM83TnjRqBHMRNdvP5jZZNsvX_g82m_ChXvNN_wo10myMuiOf52R5QqgKsOTI-v6KaWiwOkIt02zL31nAXUvBApi4WmleL4Ym-__KMzDEL0mPkSjCHOHT-5d4lWX_d7xd8Er_lKMBBBmrY1BhLG1DeK6HDJZ7zDaSJxEBSHcfXoe_JINtKBI05zLeemHVe9VjIFiDVDfHCGqiuidpWLBkQGqDe9zI';

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