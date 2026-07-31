import styles from './BrandStorySection.module.css';

const STORY_IMAGE =
    'https://lh3.googleusercontent.com/aida/AP1WRLvHwFa1iVhVbkK3O_RKJyWNv8dIJMma8U07igJB9lKC9-MMi2NszWyoORmk6WCppfyf7qa3utDKbKZC3XznACvlkkyJ6nVjX3yZBHnWL3C9M81meqkLKHhr611Lj7HUZvc0doNWx7BfrceVEjB_5wXrDWfsFUzAFeagSVUfmeqqcqtPzC3znEBgQfteGIj3aMrmla-yqxy9XtfzZg49kqr1Vhc5rwFeG9ByysQhqr8sfno-JSh2mF1oJA';

function BrandStorySection() {
    return (
        <section className={styles.section}>
            <div className={styles.imageWrapper}>
                <div className={styles.imageBackdrop} />
                <img src={STORY_IMAGE} alt="Lifestyle Photography" className={styles.image} />
            </div>

            <div className={styles.textBlock}>
                <span className={styles.label}>Our Heritage</span>
                <h2 className={styles.heading}>A Legacy of Precision &amp; Elegance</h2>
                <p className={styles.paragraph}>
                    Founded in the heart of urban sophistication, Urban Layers Co. was born from a
                    singular vision: to treat digital accessories as curated art pieces. We believe
                    that the objects you carry every day should reflect your personal standard of
                    excellence.
                </p>
                <p className={styles.paragraph}>
                    Every curve, material choice, and finish is intentional. We combine
                    aerospace-grade carbon fiber with artisanal leathers to create a sensory
                    experience that transcends mere functionality.
                </p>
                <div className={styles.linkWrapper}>
                    <a href="#craftsmanship" className={styles.link}>
                        Discover Our Materials
                    </a>
                </div>
            </div>
        </section>
    );
}

export default BrandStorySection;