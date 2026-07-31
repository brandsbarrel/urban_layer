import styles from './LifestyleBanner.module.css';

const BANNER_IMAGE =
    'https://lh3.googleusercontent.com/aida-public/AB6AXuCHqyXon2sH5szT0G6GbWbKDq4HCLTECfJix_cEwlenNuIxml_lTInP2bOfbD33b3wWNEqogP7YwPTDjT7F3v5d4QuuryyFJUH8-cDnEVVz-4UxGx52Tl0wmnfuikrvgExATQdqYndlFkQiygPwY1eXHEioCigalirLn8dol2nSFwhinaH_0o1RydOIRx4u804TfLmoa45Fs2SDQ-IwHsbxBZT9vr-xs6jWypKwlqSBTHDN2hKx5eG5t5tElgowha4ivUPdn6lmsDQ';

function LifestyleBanner() {
    const scrollToNewsletter = (e) => {
        e.preventDefault();
        document.getElementById('footer-newsletter')?.scrollIntoView({ behavior: 'smooth' });
    };

    return (
        <section className={styles.banner} style={{ backgroundImage: `url('${BANNER_IMAGE}')` }}>
            <div className={styles.overlay} />
            <div className={styles.content}>
                <h3 className={styles.heading}>Engineered for the Modern Urbanite.</h3>
                <button onClick={scrollToNewsletter} className={styles.link}>
                    Join the Inner Circle
                </button>
            </div>
        </section>
    );
}

export default LifestyleBanner;