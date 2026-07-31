import { Link } from 'react-router-dom';
import { MdVerified } from 'react-icons/md';
import { spotlightData } from '../../../services/collectionsPageData';
import styles from './CollectionSpotlightSection.module.css';

function CollectionSpotlightSection() {
    return (
        <section className={styles.section}>
            <div className={styles.imageWrapper}>
                <img src={spotlightData.image} alt={spotlightData.heading} className={styles.image} />
            </div>
            <div className={styles.content}>
                <span className={styles.eyebrow}>{spotlightData.eyebrow}</span>
                <h2 className={styles.heading}>{spotlightData.heading}</h2>
                <p className={styles.description}>{spotlightData.description}</p>
                <ul className={styles.checklist}>
                    {spotlightData.checklist.map((item) => (
                        <li key={item} className={styles.checkItem}>
                            <MdVerified size={20} className={styles.checkIcon} />
                            <span>{item}</span>
                        </li>
                    ))}
                </ul>
                <Link to="/about#craftsmanship" className={styles.link}>
                    Discover the Craftsmanship
                </Link>
            </div>
        </section>
    );
}

export default CollectionSpotlightSection;