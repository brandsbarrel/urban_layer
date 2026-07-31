import styles from './MissionVisionSection.module.css';

function MissionVisionSection() {
    return (
        <section id="mission-vision" className={styles.section}>
            <div className={styles.block}>
                <h3 className={styles.heading}>Our Mission</h3>
                <p className={styles.text}>
                    To empower the modern professional by providing protection that never compromises
                    on aesthetic integrity. We strive to lead the industry in sustainable luxury and
                    technological integration.
                </p>
            </div>
            <div className={styles.block}>
                <h3 className={styles.heading}>Our Vision</h3>
                <p className={styles.text}>
                    To become the global standard for high-end digital architecture—where every Urban
                    Layers product is recognized as a hallmark of quality, innovation, and timeless
                    design.
                </p>
            </div>
        </section>
    );
}

export default MissionVisionSection;