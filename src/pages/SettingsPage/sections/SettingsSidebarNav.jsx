import { useState } from 'react';
import { Link } from 'react-router-dom';
import { settingsNavItems } from '../../../services/settingsPageData';
import styles from './SettingsSidebarNav.module.css';

function SettingsSidebarNav({ pointsToNextTier, nextTier }) {
  const [activeId, setActiveId] = useState('personal-info');

  const handleClick = (id) => (e) => {
    e.preventDefault();
    setActiveId(id);
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <aside className={styles.sidebar}>
      <nav className={styles.nav}>
        {settingsNavItems.map((item) => (
          <a
            key={item.id}
            href={`#${item.id}`}
            onClick={handleClick(item.id)}
            className={activeId === item.id ? `${styles.link} ${styles.linkActive}` : styles.link}
          >
            <item.icon size={20} />
            <span>{item.label}</span>
          </a>
        ))}
      </nav>

      <div className={styles.promoCard}>
        <p className={styles.promoLabel}>Exclusive Offer</p>
        <p className={styles.promoText}>
          You're {pointsToNextTier} points away from {nextTier} status.
        </p>
        <Link to="/account" className={styles.promoButton}>
          View Benefits
        </Link>
      </div>
    </aside>
  );
}

export default SettingsSidebarNav;