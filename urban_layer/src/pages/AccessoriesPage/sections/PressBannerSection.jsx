import { pressLogos } from '../../../services/accessoriesPageData';
import styles from './PressBannerSection.module.css';

function PressBannerSection() {
    return (
        <section className={styles.section}>
            <div className={styles.gridPattern} />
            <div className={styles.container}>
                <h2 className={styles.heading}>Designed to Match Your Lifestyle</h2>
                <div className={styles.logoRow}>
                    {pressLogos.map((logo) => (
                        <span key={logo} className={styles.logo}>
                            {logo}
                        </span>
                    ))}
                </div>
                <p className={styles.quote}>
                    "Urban Layers accessories bring a level of refined elegance to utilitarian tech. It's
                    not just a charger; it's a statement piece for your desk."
                </p>
                <button type="button" className={styles.ctaButton}>
                    JOIN THE CIRCLE
                </button>
            </div>
        </section>
    );
}

export default PressBannerSection;