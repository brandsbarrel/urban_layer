import { Link } from 'react-router-dom';
import { MdArrowBack } from 'react-icons/md';
import styles from './AuthHeader.module.css';

function AuthHeader({
  variant = 'overlay',
  backLabel = 'Back to Store',
  backIcon: BackIcon = MdArrowBack,
  backPath = '/',
  brandText = 'URBAN LAYERS',
  showBack = true,
}) {
  const isSolid = variant === 'solid';
  const headerClass = isSolid ? styles.headerSolid : styles.headerOverlay;
  const navClass = `${isSolid ? styles.navSolid : styles.navOverlay} ${!showBack ? styles.navNoBack : ''}`;

  return (
    <header className={headerClass}>
      <nav className={navClass}>
        {showBack && (
          <Link to={backPath} className={isSolid ? styles.backLinkSolid : styles.backLinkOverlay}>
            <BackIcon size={20} />
            <span>{backLabel}</span>
          </Link>
        )}
        <span className={isSolid ? styles.brandSolid : styles.brandOverlay}>{brandText}</span>
        {!isSolid && showBack && <div className={styles.spacer} />}
      </nav>
    </header>
  );
}

export default AuthHeader;
