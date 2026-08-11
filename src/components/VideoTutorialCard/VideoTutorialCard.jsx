import { MdPlayArrow } from 'react-icons/md';
import styles from './VideoTutorialCard.module.css';

function VideoTutorialCard({ image, title, duration, category }) {
    const handlePlay = () => {
        // No video source available yet — honest placeholder instead of a fake player.
        window.alert('Video guide coming soon!');
    };

    return (
        <div className={styles.card}>
            <button type="button" onClick={handlePlay} className={styles.imageWrapper}>
                <img src={image} alt={title} className={styles.image} />
                <div className={styles.overlay}>
                    <div className={styles.playButton}>
                        <MdPlayArrow size={32} />
                    </div>
                </div>
            </button>
            <h3 className={styles.title}>{title}</h3>
            <p className={styles.meta}>
                {duration} • {category}
            </p>
        </div>
    );
}

export default VideoTutorialCard;