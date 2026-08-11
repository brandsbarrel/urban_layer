import { Link } from 'react-router-dom';
import { MdChevronRight } from 'react-icons/md';
import styles from './Breadcrumb.module.css';

function Breadcrumb({ items }) {
    return (
        <nav className={styles.breadcrumb}>
            {items.map((item, index) => (
                <span key={item.label} className={styles.itemWrapper}>
                    {item.path ? (
                        <Link to={item.path} className={styles.link}>
                            {item.label}
                        </Link>
                    ) : (
                        <span className={styles.current}>{item.label}</span>
                    )}
                    {index < items.length - 1 && <MdChevronRight size={14} className={styles.separator} />}
                </span>
            ))}
        </nav>
    );
}

export default Breadcrumb;