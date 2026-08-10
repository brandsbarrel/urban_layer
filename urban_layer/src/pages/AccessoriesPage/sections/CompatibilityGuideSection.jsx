import { MdSmartphone, MdDevices } from 'react-icons/md';
import styles from './CompatibilityGuideSection.module.css';

function CompatibilityGuideSection() {
    return (
        <section className={styles.section}>
            <h2 className={styles.heading}>Find Your Perfect Match</h2>
            <p className={styles.subtitle}>
                Select your device to see accessories tailored exactly to your hardware.
            </p>
            <div className={styles.grid}>
                <div className={styles.stepCard}>
                    <MdSmartphone size={40} className={styles.stepIcon} />
                    <h4 className={styles.stepTitle}>Step 1</h4>
                    <p className={styles.stepText}>Choose Brand</p>
                </div>
                <div className={styles.stepCard}>
                    <MdDevices size={40} className={styles.stepIcon} />
                    <h4 className={styles.stepTitle}>Step 2</h4>
                    <p className={styles.stepText}>Select Model</p>
                </div>
                <div className={styles.resultCard}>
                    <h4 className={styles.stepTitle}>Showing Results</h4>
                    <p className={styles.resultText}>142 COMPATIBLE ITEMS</p>
                </div>
            </div>
        </section>
    );
}

export default CompatibilityGuideSection;