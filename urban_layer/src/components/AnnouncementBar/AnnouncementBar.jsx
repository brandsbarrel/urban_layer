import styles from './AnnouncementBar.module.css';

const ANNOUNCEMENT_TEXT =
    '🚚 Free Shipping above ₹999   •   HANDCRAFTED EXCELLENCE   •   LIMITED EDITION RELEASES';

function AnnouncementBar() {
    return (
        <div className={styles.bar}>
            <div className={styles.track}>{ANNOUNCEMENT_TEXT}</div>
        </div>
    );
}

export default AnnouncementBar;