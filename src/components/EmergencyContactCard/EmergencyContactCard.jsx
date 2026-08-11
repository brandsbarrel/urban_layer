import { MdPriorityHigh } from 'react-icons/md';
import styles from './EmergencyContactCard.module.css';

function EmergencyContactCard({ email = 'priority@urbanlayers.co' }) {
    return (
        <div className={styles.card}>
            <h4 className={styles.heading}>
                <MdPriorityHigh size={20} />
                Emergency
            </h4>
            <p className={styles.text}>Lost packages or payment issues?</p>
            <a href={`mailto:${email}`} className={styles.link}>
                Contact Priority Support
            </a>
        </div>
    );
}

export default EmergencyContactCard;