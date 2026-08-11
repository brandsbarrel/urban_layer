import styles from './TrackOrderHero.module.css';

function TrackOrderHero() {
    return (
        <section className={styles.section}>
            <h1 className={styles.heading}>Track Your Order</h1>
            <p className={styles.subtitle}>
                Luxury details deserve luxury handling. Monitor the journey of your Urban Layers
                accessories from our atelier to your door.
            </p>
        </section>
    );
}

export default TrackOrderHero;