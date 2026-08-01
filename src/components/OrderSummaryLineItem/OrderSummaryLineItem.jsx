import styles from './OrderSummaryLineItem.module.css';

function OrderSummaryLineItem({ image, name, subtitle, price }) {
    return (
        <div className={styles.item}>
            <div className={styles.imageWrapper}>
                <img src={image} alt={name} className={styles.image} />
            </div>
            <div className={styles.info}>
                <h4 className={styles.name}>{name}</h4>
                <p className={styles.subtitle}>{subtitle}</p>
            </div>
            <span className={styles.price}>₹{price.toLocaleString('en-IN')}</span>
        </div>
    );
}

export default OrderSummaryLineItem;