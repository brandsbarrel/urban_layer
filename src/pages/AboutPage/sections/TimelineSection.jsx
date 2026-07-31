import TimelineItem from './TimelineItem';
import { timelineEvents } from '../../../services/aboutPageData';
import styles from './TimelineSection.module.css';

function TimelineSection() {
    return (
        <section className={styles.section}>
            <div className={styles.container}>
                <h2 className={styles.heading}>The Urban Timeline</h2>
                <div className={styles.line}>
                    {timelineEvents.map((event) => (
                        <TimelineItem key={event.year} {...event} />
                    ))}
                </div>
            </div>
        </section>
    );
}

export default TimelineSection;