import { MdNorthEast } from 'react-icons/md';
import styles from './SocialMediaCard.module.css';

function SocialMediaCard({ icon: Icon, label, handle, href }) {
    return (
        <a href={href} target="_blank" rel="noopener noreferrer" className={styles.card}>
            <div className={styles.left}>
                <div className={styles.iconCircle}>
                    <Icon size={20} />
                </div>
                <div>
                    <p className={styles.label}>{label}</p>
                    <p className={styles.handle}>{handle}</p>
                </div>
            </div>
            <MdNorthEast size={20} className={styles.arrow} />
        </a>
    );
}

export default SocialMediaCard;