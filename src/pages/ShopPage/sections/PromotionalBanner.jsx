import { promoBannerData } from '../../../services/shopPageData';
import styles from './PromotionalBanner.module.css';

function PromotionalBanner() {
    return (
        <section className={styles.section}>
            <div className={styles.container}>
                <div className={styles.textBlock}>
                    <h2 className={styles.heading}>{promoBannerData.heading}</h2>
                    <p className={styles.description}>{promoBannerData.description}</p>
                    <div className={styles.statsRow}>
                        {promoBannerData.stats.map((stat) => (
                            <div key={stat.label} className={styles.stat}>
                                <span className={styles.statValue}>{stat.value}</span>
                                <span className={styles.statLabel}>{stat.label}</span>
                            </div>
                        ))}
                    </div>
                </div>
                <div className={styles.imageWrapper}>
                    <img src={promoBannerData.image} alt="Phone case internal structure" className={styles.image} />
                </div>
            </div>
        </section>
    );
}

export default PromotionalBanner;