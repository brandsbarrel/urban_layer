import { MdPhotoCamera } from 'react-icons/md';
import styles from './JournalInstagramGrid.module.css';

function JournalInstagramGrid({ images, handle }) {
    return (
        <div className={styles.grid}>
            {images.map((image, index) => (
                <div key={index} className={styles.tile}>
                    <img src={image.src} alt={image.alt} className={styles.image} />
                </div>
            ))}
            <a
                href={`https://instagram.com/${handle.replace('@', '')}`}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.followTile}
            >
                <MdPhotoCamera size={22} className={styles.followIcon} />
                <p className={styles.followText}>Follow Us {handle}</p>
            </a>
        </div>
    );
}

export default JournalInstagramGrid;