import { Link } from 'react-router-dom';
import CountdownTimer from '../../../components/CountdownTimer/CountdownTimer';
import { limitedEditionData } from '../../../services/collectionsPageData';
import styles from './LimitedEditionSection.module.css';

function LimitedEditionSection() {
    return (
        <section className={styles.section}>
            <div className={styles.container}>
                <h2 className={styles.heading}>{limitedEditionData.heading}</h2>
                <p className={styles.description}>{limitedEditionData.description}</p>
                <CountdownTimer
                    days={limitedEditionData.days}
                    hours={limitedEditionData.hours}
                    minutes={limitedEditionData.minutes}
                />
                <Link to="/collections/limited-edition" className={styles.ctaButton}>
                    Reserve Yours Now
                </Link>
            </div>
        </section>
    );
}

export default LimitedEditionSection;