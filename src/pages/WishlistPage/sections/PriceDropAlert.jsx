import { Link } from 'react-router-dom';
import { MdSell } from 'react-icons/md';
import { priceDropAlert } from '../../../services/wishlistPageData';
import styles from './PriceDropAlert.module.css';

function PriceDropAlert() {
    return (
        <section className={styles.section}>
            <div className={styles.banner}>
                <div className={styles.left}>
                    <div className={styles.iconWrapper}>
                        <MdSell size={22} />
                    </div>
                    <p className={styles.text}>
                        Good News! The <strong>{priceDropAlert.productName}</strong> you saved is now{' '}
                        <span className={styles.discount}>{priceDropAlert.discountLabel}</span>.
                    </p>
                </div>
                <Link to={priceDropAlert.productPath} className={styles.viewButton}>
                    View Offer
                </Link>
            </div>
        </section>
    );
}

export default PriceDropAlert;