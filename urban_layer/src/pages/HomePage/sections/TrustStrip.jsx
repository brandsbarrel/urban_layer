import { MdAutorenew, MdLocalShipping, MdOutlineDiamond, MdShield } from 'react-icons/md';
import styles from './TrustStrip.module.css';

const trustItems = [
  {
    id: 'shipping',
    icon: MdLocalShipping,
    title: 'Free Shipping',
    text: 'On orders above Rs.999',
  },
  {
    id: 'protection',
    icon: MdShield,
    title: 'Drop-Tested Protection',
    text: 'Built for everyday impact',
  },
  {
    id: 'handcrafted',
    icon: MdOutlineDiamond,
    title: 'Handcrafted',
    text: 'Finished with attention to detail',
  },
  {
    id: 'returns',
    icon: MdAutorenew,
    title: 'Easy Returns',
    text: 'Simple, hassle-free returns',
  },
];

function TrustStrip() {
  return (
    <section className={styles.strip} aria-label="Shopping benefits">
      <div className={styles.grid}>
        {trustItems.map((item) => {
          const Icon = item.icon;
          return (
            <article className={styles.item} key={item.id}>
              <Icon className={styles.icon} aria-hidden="true" />
              <div>
                <h2>{item.title}</h2>
                <p>{item.text}</p>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}

export default TrustStrip;
