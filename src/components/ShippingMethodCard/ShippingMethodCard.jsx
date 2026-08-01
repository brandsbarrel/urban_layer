import { MdCheckCircle } from 'react-icons/md';
import styles from './ShippingMethodCard.module.css';

function ShippingMethodCard({ id, name, label, price, priceLabel, estimatedDelivery, selected, onSelect }) {
    return (
        <div className={styles.wrapper}>
            <input
                type="radio"
                id={id}
                name={name}
                checked={selected}
                onChange={() => onSelect(id)}
                className={styles.radioInput}
            />
            <label
                htmlFor={id}
                className={selected ? `${styles.card} ${styles.cardSelected}` : styles.card}
            >
                <div className={styles.header}>
                    <span className={styles.title}>{label}</span>
                    <span className={styles.price}>{priceLabel}</span>
                </div>
                <p className={styles.delivery}>Est. Delivery: {estimatedDelivery}</p>
                {selected && (
                    <div className={styles.checkIcon}>
                        <MdCheckCircle size={22} />
                    </div>
                )}
            </label>
        </div>
    );
}

export default ShippingMethodCard;