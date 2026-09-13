import { Link } from 'react-router-dom';
import styles from './ShopByDevice.module.css';

function ShopByDevice({ devices = [] }) {
  return (
    <section className={styles.section}>
      <div className={styles.header}>
        <p className={styles.eyebrow}>Device fit</p>
        <h2>Find Your Fit</h2>
        <p>Choose your device to discover cases engineered around its exact form.</p>
      </div>
      <div className={styles.grid}>
        {devices.map((device) => (
          <Link to={device.href} className={styles.card} key={device.id}>
            <span className={styles.imageWrap}>
              <img src={device.image} alt={device.imageAlt} loading="lazy" />
            </span>
            <span className={styles.name}>{device.name}</span>
            <span className={styles.cta}>Shop this fit</span>
          </Link>
        ))}
      </div>
    </section>
  );
}

export default ShopByDevice;
