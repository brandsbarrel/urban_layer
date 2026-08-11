import StatCounter from '../../../components/StatCounter/StatCounter';
import { achievements } from '../../../services/aboutPageData';
import styles from './AchievementsSection.module.css';

function AchievementsSection() {
    return (
        <section className={styles.section}>
            <div className={styles.grid}>
                {achievements.map((item) => (
                    <StatCounter key={item.label} value={item.value} label={item.label} />
                ))}
            </div>
        </section>
    );
}

export default AchievementsSection;