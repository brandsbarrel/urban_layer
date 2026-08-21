import { MdPlayArrow } from 'react-icons/md';
import styles from './CinematicVideoBanner.module.css';

function CinematicVideoBanner({ image, label, title }) {
    const handlePlay = () => {
        window.alert('Full film coming soon!');
    };

    return (
        <button type="button" onClick={handlePlay} className={styles.wrapper}>
            <img src={image} alt={title} className={styles.image} />
            <div className={styles.overlay} />
            <div className={styles.playCircle}>
                <MdPlayArrow size={40} />
            </div>
            <div className={styles.content}>
                <span className={styles.label}>{label}</span>
                <h3 className={styles.title}>{title}</h3>
            </div>
        </button>
    );
}

export default CinematicVideoBanner;