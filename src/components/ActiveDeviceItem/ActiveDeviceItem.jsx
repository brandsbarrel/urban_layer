import styles from './ActiveDeviceItem.module.css';

function ActiveDeviceItem({ icon: Icon, name, meta, isCurrent, onSignOut }) {
    return (
        <div className={isCurrent ? `${styles.item} ${styles.itemCurrent}` : styles.item}>
            <div className={styles.left}>
                <Icon size={22} className={isCurrent ? styles.iconCurrent : styles.icon} />
                <div>
                    <p className={styles.name}>{name}</p>
                    <p className={styles.meta}>{meta}</p>
                </div>
            </div>
            {isCurrent ? (
                <span className={styles.activeLabel}>Active</span>
            ) : (
                <button type="button" onClick={onSignOut} className={styles.signOutButton}>
                    Sign Out
                </button>
            )}
        </div>
    );
}

export default ActiveDeviceItem;