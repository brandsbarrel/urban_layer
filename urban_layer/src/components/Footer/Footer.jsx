import { Link } from 'react-router-dom';
import { MdPublic, MdShare } from 'react-icons/md';
import NewsletterSignup from '../NewsletterSignup/NewsletterSignup';
import { FOOTER_LINKS } from '../../utils/constants';
import styles from './Footer.module.css';

const LOGO_IMAGE =
  'https://lh3.googleusercontent.com/aida/AP1WRLuM8MJ3KmurenQcOLHRpiykXhdIlUWmGH2uIzgwngzBiE_pmX-vaLFNFgPrYhPkk_7GphrkrQcKij7hhHljKNqd5adJpgSv3HSQHWhH6IdyWyO3EdW8OyXnaLS2XamQr3NbqnULxKlan16wXIxek9BaWePbDfIYO2jOI9sWCGivl3t2U8QwE888AaxW5tHq1m9rzHH3d9Rx6jR-flBS-9R88oLeKr2CscYlmsr2IEv0lcHrlxyN4FhH7w';

function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.grid}>
        <div className={styles.brandColumn}>
          <Link to="/" className={styles.brand}>
            <img src={LOGO_IMAGE} alt="Urban Layers Co." className={styles.logoImage} />
            <span className={styles.brandName}>Urban Layers Co.</span>
          </Link>
          <p className={styles.tagline}>
            Elevating everyday technology through meticulous design and premium materials.
            Experience the art of protection.
          </p>
          <div className={styles.socials}>
            <a href="#" className={styles.socialIcon} aria-label="Website">
              <MdPublic size={20} />
            </a>
            <a href="#" className={styles.socialIcon} aria-label="Share">
              <MdShare size={20} />
            </a>
          </div>
        </div>

        <div className={styles.linkColumn}>
          <h6 className={styles.columnTitle}>Shop</h6>
          <ul>
            {FOOTER_LINKS.shop.map((link) => (
              <li key={link.path}>
                <Link to={link.path} className={styles.footerLink}>
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className={styles.linkColumn}>
          <h6 className={styles.columnTitle}>Support</h6>
          <ul>
            {FOOTER_LINKS.support.map((link) => (
              <li key={link.path}>
                <Link to={link.path} className={styles.footerLink}>
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className={styles.newsletterColumn} id="footer-newsletter">
          <h6 className={styles.columnTitle}>Newsletter</h6>
          <p className={styles.newsletterText}>
            Subscribe to receive updates, access to exclusive deals, and more.
          </p>
          <NewsletterSignup variant="compact" />
        </div>
      </div>

      <div className={styles.bottomBar}>
        <p className={styles.copyright}>
          © {new Date().getFullYear()} Urban Layers Co. Handcrafted Excellence. All Rights
          Reserved.
        </p>
      </div>
    </footer>
  );
}

export default Footer;