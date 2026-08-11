import styles from './LocationMapCard.module.css';

function LocationMapCard({ image, storeName, addressLine }) {
    return (
        <div className={styles.wrapper}>
            <img src={image} alt={`${storeName} location map`} className={styles.image} />
            <div className={styles.infoCard}>
                <p className={styles.storeName}>{storeName}</p>
                <p className={styles.addressLine}>{addressLine}</p>
            </div>
        </div>
    );
}

export default LocationMapCard;