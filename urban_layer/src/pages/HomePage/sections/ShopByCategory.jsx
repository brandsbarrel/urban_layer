import { Link } from 'react-router-dom';
import styles from './ShopByCategory.module.css';

function ShopByCategory({ categories = [] }) {
  return (
    <section className={styles.section}>
      <div className={styles.header}>
        <p className={styles.eyebrow}>Materials</p>
        <h2>Choose Your Material</h2>
        <p>Different textures. Different character. One uncompromising standard.</p>
      </div>
      <div className={styles.grid}>
        {categories.map((category) => (
          <Link to={category.href} className={styles.card} key={category.id}>
            <span className={styles.imageWrap}>
              <img src={category.image} alt={category.imageAlt} loading="lazy" />
            </span>
            <span className={styles.content}>
              <span className={styles.name}>{category.name}</span>
              <span className={styles.description}>{category.description}</span>
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}

export default ShopByCategory;
