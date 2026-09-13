import { Link } from 'react-router-dom';
import styles from './MaterialStory.module.css';

function MaterialStory({ story }) {
  return (
    <section className={styles.section}>
      <div className={styles.imagePanel}>
        <img
          src={story?.image || '/images/craft/leather-case-texture-closeup.jpg'}
          alt={story?.imageAlt || 'Close-up of leather phone case texture'}
          loading="lazy"
        />
      </div>
      <div className={styles.content}>
        <p className={styles.eyebrow}>Craftsmanship</p>
        <h2>Made to Be Felt.</h2>
        <p>
          Every Urban Layers case begins with the material. We select finishes for the way they
          feel in your hand, then refine every edge and detail for a precise fit. From tactile
          leather to technical carbon fiber, each case is finished with the same attention to
          durability, texture, and proportion.
        </p>
        <Link to="/about" className={styles.button}>
          Discover Our Craft
        </Link>
      </div>
    </section>
  );
}

export default MaterialStory;