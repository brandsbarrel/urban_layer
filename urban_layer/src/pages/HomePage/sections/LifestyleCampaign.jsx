import { Link } from 'react-router-dom';
import styles from './LifestyleCampaign.module.css';

function LifestyleCampaign({ banner }) {
  return (
    <section className={styles.banner}>
      <img src={banner?.image} alt={banner?.imageAlt || 'Urban lifestyle with premium case'} loading="lazy" />
      <div className={styles.overlay} />
      <div className={styles.content}>
        <h2>Engineered for the Modern Urbanite.</h2>
        <p>Protection that belongs wherever the day takes you.</p>
        <Link to="/collections" className={styles.button}>
          Shop Premium Collection
        </Link>
      </div>
    </section>
  );
}

export default LifestyleCampaign;
