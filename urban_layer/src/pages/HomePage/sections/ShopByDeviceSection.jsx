import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  MdSmartphone,
  MdPhoneAndroid,
  MdWatch,
  MdArrowForward,
} from 'react-icons/md';
import { FaGoogle } from 'react-icons/fa';

import DeviceCategoryCard from '../../../components/DeviceCategoryCard/DeviceCategoryCard';
import { getCategories } from '../../../services/productsService';
import styles from './ShopByDeviceSection.module.css';

const ICONS = [
  MdSmartphone,
  MdPhoneAndroid,
  FaGoogle,
  MdWatch,
];

function ShopByDeviceSection() {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const data = await getCategories();
        setCategories(data);
      } catch (err) {
        console.error(err);
      }
    };

    loadCategories();
  }, []);

  return (
    <section className={styles.section}>
      <div className={styles.header}>
        <div>
          <h3 className={styles.heading}>Shop By Device</h3>
          <div className={styles.underline} />
        </div>

        <Link to="/compatibility" className={styles.viewAllLink}>
          View Compatibility <MdArrowForward size={18} />
        </Link>
      </div>

      <div className={styles.grid}>
        {categories.map((category, index) => {
          const Icon = ICONS[index % ICONS.length];

          return (
            <DeviceCategoryCard
              key={category.id}
              icon={Icon}
              label={category.name}
              path={`/shop?category=${category.slug}`}
            />
          );
        })}
      </div>
    </section>
  );
}

export default ShopByDeviceSection;