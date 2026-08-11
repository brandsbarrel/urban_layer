import { MdWorkspacePremium } from 'react-icons/md';
import styles from './RewardProgressCard.module.css';

function RewardProgressCard({ points, completion }) {
    return (
        <div className={styles.card}>
            <div className={styles.topRow}>
                <div>
                    <p className={styles.label}>Reward Points</p>
                    <p className={styles.points}>{points.toLocaleString('en-IN')}</p>
                </div>
                <MdWorkspacePremium size={22} className={styles.icon} />
            </div>
            <div className={styles.progressBlock}>
                <div className={styles.progressLabels}>
                    <span>Profile Completion</span>
                    <span>{completion}%</span>
                </div>
                <div className={styles.track}>
                    <div className={styles.fill} style={{ width: `${completion}%` }} />
                </div>
            </div>
        </div>
    );
}

export default RewardProgressCard;