import { useState } from 'react';
import { MdCheckCircle, MdPlayArrow } from 'react-icons/md';
import { craftsmanshipHighlights } from '../../../services/aboutPageData';
import styles from './CraftsmanshipSection.module.css';

const CRAFT_IMAGE =
    'https://lh3.googleusercontent.com/aida-public/AB6AXuAUjuQT1DzaJS_JG3id72rByUpWUrnhuLwIou0ALld-K6VgxBMVv_1i7iPh_imBhEg98sgEz7J0Qa33kWOkt9DZSuYdAYjn4_wXpQ1QU7CtMDZZdOv5Ebyn9dADRPqBS2rJQCq1FNxLtCjlzH9zF2NJiiPFULYRrQ7srTsZ-FdJ_EUf8j0DtSgv-s2rq5TLNAxs-hmIAR95WLwgKQM3BVUSMDgqAeJer3UvEczVLh1EPiab1GfxPTjYJnXqRiGXsNXOkg5cBtW8Fhk';

function CraftsmanshipSection() {
    const [showComingSoon, setShowComingSoon] = useState(false);

    return (
        <section id="craftsmanship" className={styles.section}>
            <div className={styles.container}>
                <div className={styles.textBlock}>
                    <span className={styles.label}>Craftsmanship</span>
                    <h2 className={styles.heading}>A Symphony of Strength &amp; Softness</h2>
                    <div className={styles.body}>
                        <p className={styles.paragraph}>
                            Our manufacturing process is a delicate balance between machine precision and
                            human touch. Every case is hand-finished by master craftsmen who have spent
                            decades perfecting their trade.
                        </p>
                        <ul className={styles.list}>
                            {craftsmanshipHighlights.map((point) => (
                                <li key={point} className={styles.listItem}>
                                    <MdCheckCircle className={styles.checkIcon} />
                                    <span>{point}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                <div className={styles.mediaBlock}>
                    <div className={styles.mediaFrame}>
                        <img
                            src={CRAFT_IMAGE}
                            alt="Craftsman stitching leather"
                            className={styles.mediaImage}
                        />
                        <div className={styles.mediaOverlay}>
                            <button
                                className={styles.playButton}
                                onClick={() => setShowComingSoon(true)}
                                aria-label="Play video"
                            >
                                <MdPlayArrow size={32} />
                            </button>
                        </div>
                    </div>
                    {showComingSoon && <p className={styles.comingSoon}>Video coming soon</p>}
                </div>
            </div>
        </section>
    );
}

export default CraftsmanshipSection;