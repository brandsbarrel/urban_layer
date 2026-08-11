import styles from './OrderSummaryLineItem.module.css';

function OrderSummaryLineItem({ image, name, subtitle, price, variant = 'compact', quantity }) {
    if (variant === 'card') {
        return (
            <div className={styles.cardItem}>
                <div className={styles.cardImageWrapper}>
                    <img src={image} alt={name} className={styles.cardImage} />
                </div>
                <div className={styles.cardInfo}>
                    <div className={styles.cardTopRow}>
                        <div>
                            <h4 className={styles.cardName}>{name}</h4>
                            <p className={styles.cardSubtitle}>{subtitle}</p>
                        </div>
                        <span className={styles.cardPrice}>₹{price.toLocaleString('en-IN')}</span>
                    </div>
                    {quantity != null && <span className={styles.cardQty}>Qty: {quantity}</span>}
                </div>
            </div>
        );
    }

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