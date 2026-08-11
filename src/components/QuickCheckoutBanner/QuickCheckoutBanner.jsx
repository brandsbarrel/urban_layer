import { Link } from 'react-router-dom';
import styles from './QuickCheckoutBanner.module.css';

function QuickCheckoutBanner({ heading, subtitle, ctaLabel, ctaPath }) {
    return (
        <section className={styles.section}>
            <div className={styles.dotPattern} />
            <div className={styles.content}>
                <div>
                    <h2 className={styles.heading}>{heading}</h2>
                    <p className={styles.subtitle}>{subtitle}</p>
                </div>
                <Link to={ctaPath} className={styles.ctaButton}>
                    {ctaLabel}
                </Link>
            </div>
        </section>
    );
}

export default QuickCheckoutBanner;