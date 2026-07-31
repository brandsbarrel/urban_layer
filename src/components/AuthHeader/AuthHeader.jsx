import { Link } from 'react-router-dom';
import { MdArrowBack } from 'react-icons/md';
import styles from './AuthHeader.module.css';

function AuthHeader({
  variant = 'overlay',
  backLabel = 'Back to Store',
  backIcon: BackIcon = MdArrowBack,
  backPath = '/',
  brandText = 'URBAN LAYERS',
}) {
  const isSolid = variant === 'solid';

  return (
    <header className={isSolid ? styles.headerSolid : styles.headerOverlay}>
      <nav className={isSolid ? styles.navSolid : styles.navOverlay}>
        <Link to={backPath} className={isSolid ? styles.backLinkSolid : styles.backLinkOverlay}>
          <BackIcon size={20} />
          <span>{backLabel}</span>
        </Link>
        <span className={isSolid ? styles.brandSolid : styles.brandOverlay}>{brandText}</span>
        {!isSolid && <div className={styles.spacer} />}
      </nav>
    </header>
  );
}

export default AuthHeader;