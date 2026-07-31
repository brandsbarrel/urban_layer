import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import {
  MdSearch,
  MdFavoriteBorder,
  MdShoppingBag,
  MdPersonOutline,
  MdMenu,
  MdClose,
} from 'react-icons/md';
import { NAV_LINKS } from '../../utils/constants';
import { selectCartCount } from '../../redux/slices/cartSlice';
import { selectWishlistCount } from '../../redux/slices/wishlistSlice';
import styles from './Navbar.module.css';

const LOGO_IMAGE =
  'https://lh3.googleusercontent.com/aida/AP1WRLuM8MJ3KmurenQcOLHRpiykXhdIlUWmGH2uIzgwngzBiE_pmX-vaLFNFgPrYhPkk_7GphrkrQcKij7hhHljKNqd5adJpgSv3HSQHWhH6IdyWyO3EdW8OyXnaLS2XamQr3NbqnULxKlan16wXIxek9BaWePbDfIYO2jOI9sWCGivl3t2U8QwE888AaxW5tHq1m9rzHH3d9Rx6jR-flBS-9R88oLeKr2CscYlmsr2IEv0lcHrlxyN4FhH7w';

function Navbar() {
  const location = useLocation();
  const cartCount = useSelector(selectCartCount);
  const wishlistCount = useSelector(selectWishlistCount);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const closeMenu = () => setIsMenuOpen(false);

  return (
    <header className={`${styles.navbar} ${isScrolled ? styles.navbarScrolled : ''}`}>
      <div className={styles.inner}>
        <Link to="/" className={styles.brand} onClick={closeMenu}>
          <img src={LOGO_IMAGE} alt="Urban Layers Co. Logo" className={styles.logoImage} />
          <h1 className={styles.brandName}>Urban Layers Co.</h1>
        </Link>

        <nav className={styles.links}>
          {NAV_LINKS.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={
                location.pathname === link.path
                  ? `${styles.link} ${styles.linkActive}`
                  : styles.link
              }
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className={styles.actions}>
          <Link to="/search" className={styles.iconButton} aria-label="Search">
            <MdSearch size={22} />
          </Link>
          <Link to="/wishlist" className={styles.iconButton} aria-label="Wishlist">
            <MdFavoriteBorder size={22} />
            {wishlistCount > 0 && <span className={styles.countBadge}>{wishlistCount}</span>}
          </Link>
          <Link to="/cart" className={styles.iconButton} aria-label="Cart">
            <MdShoppingBag size={22} />
            {cartCount > 0 && <span className={styles.countBadge}>{cartCount}</span>}
          </Link>
          <Link to="/login" className={styles.iconButton} aria-label="Account">
            <MdPersonOutline size={22} />
          </Link>
          <button
            className={styles.hamburgerButton}
            onClick={() => setIsMenuOpen((prev) => !prev)}
            aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={isMenuOpen}
          >
            {isMenuOpen ? <MdClose size={24} /> : <MdMenu size={24} />}
          </button>
        </div>
      </div>

      <div className={`${styles.mobileMenu} ${isMenuOpen ? styles.mobileMenuOpen : ''}`}>
        {NAV_LINKS.map((link) => (
          <Link
            key={link.path}
            to={link.path}
            onClick={closeMenu}
            className={
              location.pathname === link.path
                ? `${styles.mobileLink} ${styles.mobileLinkActive}`
                : styles.mobileLink
            }
          >
            {link.label}
          </Link>
        ))}
      </div>

      {isMenuOpen && <div className={styles.backdrop} onClick={closeMenu} />}
    </header>
  );
}

export default Navbar;