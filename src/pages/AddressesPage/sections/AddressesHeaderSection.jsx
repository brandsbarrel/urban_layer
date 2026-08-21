import styles from './AddressesHeaderSection.module.css';

function AddressesHeaderSection({ name, count }) {
    return (
        <header className={styles.header}>
            <div>
                <h1 className={styles.heading}>Your Curated Address Book, {name}</h1>
                <p className={styles.subtitle}>
                    Manage your delivery destinations for a seamless aesthetic experience.
                </p>
            </div>
            <div className={styles.badge}>
                <span className={styles.dot} />
                <span>
                    {count} Active {count === 1 ? 'Address' : 'Addresses'}
                </span>
            </div>
        </header>
    );
}

export default AddressesHeaderSection;