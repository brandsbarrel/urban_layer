import { MdPersonPinCircle, MdFullscreen } from 'react-icons/md';
import styles from './LiveTrackingMap.module.css';

function LiveTrackingMap({ mapImage, isLive, checkpoint }) {
    return (
        <div className={styles.wrapper}>
            <img src={mapImage} alt="Delivery route map" className={styles.image} />
            <div className={styles.gradient} />
            <div className={styles.content}>
                <div className={styles.topRow}>
                    <div className={isLive ? styles.liveBadge : styles.staticBadge}>
                        {isLive && (
                            <span className={styles.pulseWrapper}>
                                <span className={styles.pulseRing} />
                                <span className={styles.pulseDot} />
                            </span>
                        )}
                        <span>{isLive ? 'Live Tracking Active' : 'Tracking Update Pending'}</span>
                    </div>
                    <button type="button" className={styles.fullscreenButton} aria-label="Expand map">
                        <MdFullscreen size={20} />
                    </button>
                </div>

                <div className={styles.checkpointCard}>
                    <div className={styles.checkpointIcon}>
                        <MdPersonPinCircle size={24} />
                    </div>
                    <div>
                        <p className={styles.checkpointLabel}>Last checkpoint</p>
                        <p className={styles.checkpointValue}>{checkpoint}</p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default LiveTrackingMap;