import { Link } from 'react-router-dom';
import styles from './MinimalFooter.module.css';

const LINKS = [
    { label: 'Privacy Policy', path: '/privacy-policy' },
    { label: 'Terms of Service', path: '/terms-conditions' },
    { label: 'Shipping Information', path: '/shipping-policy' },
    { label: 'Return Policy', path: '/return-refund-policy' },
];

function MinimalFooter() {
    return (
        <footer className={styles.footer}>
            <div className={styles.inner}>
                <div className={styles.brand}>Urban Layers Co.</div>
                <div className={styles.links}>
                    {LINKS.map((link) => (
                        <Link key={link.path} to={link.path} className={styles.link}>
                            {link.label}
                        </Link>
                    ))}
                </div>
                <p className={styles.copyright}>
                    © {new Date().getFullYear()} Urban Layers Co. All rights reserved.
                </p>
            </div>
        </footer>
    );
}

export default MinimalFooter;