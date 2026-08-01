import { Link } from 'react-router-dom';
import { MdCreditCard, MdContactless, MdAccountBalanceWallet, MdShoppingBag } from 'react-icons/md';
import styles from './MinimalFooter.module.css';

const LINKS = [
  { label: 'Privacy Policy', path: '/privacy-policy' },
  { label: 'Terms of Service', path: '/terms-conditions' },
  { label: 'Shipping Information', path: '/shipping-policy' },
  { label: 'Return Policy', path: '/return-refund-policy' },
];

const PAYMENT_ICONS = [MdCreditCard, MdContactless, MdAccountBalanceWallet, MdShoppingBag];

function MinimalFooter({ variant = 'default' }) {
  const showPayment = variant === 'withPayment';

  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>
        {showPayment ? (
          <div className={styles.brandBlock}>
            <span className={styles.brand}>Urban Layers Co.</span>
            <p className={styles.copyrightInline}>© {new Date().getFullYear()} Urban Layers Co. All rights reserved.</p>
          </div>
        ) : (
          <div className={styles.brand}>Urban Layers Co.</div>
        )}

        <div className={styles.links}>
          {LINKS.map((link) => (
            <Link key={link.path} to={link.path} className={styles.link}>
              {link.label}
            </Link>
          ))}
        </div>

        {showPayment ? (
          <div className={styles.paymentIcons}>
            {PAYMENT_ICONS.map((Icon, index) => (
              <Icon key={index} size={24} />
            ))}
          </div>
        ) : (
          <p className={styles.copyright}>
            © {new Date().getFullYear()} Urban Layers Co. All rights reserved.
          </p>
        )}
      </div>
    </footer>
  );
}

export default MinimalFooter;