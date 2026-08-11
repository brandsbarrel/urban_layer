import CinematicVideoBanner from '../../../components/CinematicVideoBanner/CinematicVideoBanner';
import { cinematicVideo } from '../../../services/journalPageData';
import styles from './CinematicInsightsSection.module.css';

function CinematicInsightsSection() {
    return (
        <section id="cinematic-insights" className={styles.section}>
            <h2 className={styles.heading}>Cinematic Insights</h2>
            <CinematicVideoBanner {...cinematicVideo} />
        </section>
    );
}

export default CinematicInsightsSection;