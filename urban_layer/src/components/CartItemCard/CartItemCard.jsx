import styles from './CartItemCard.module.css';
import QuantityStepper from '../QuantityStepper/QuantityStepper';

function CartItemCard({ item, onIncrement, onDecrement, onSaveForLater, onRemove }) {
    return (
        <div className={styles.card}>
            <div className={styles.imageWrapper}>
                <img src={item.image} alt={item.name} className={styles.image} />
            </div>
            <div className={styles.info}>
                <div className={styles.topRow}>
                    <div>
                        <h3 className={styles.name}>{item.name}</h3>
                        <p className={styles.subtitle}>{item.subtitle}</p>
                    </div>
                    <span className={styles.price}>₹{item.price.toLocaleString('en-IN')}</span>
                </div>
                <div className={styles.bottomRow}>
                    <QuantityStepper
                        quantity={item.quantity}
                        onIncrement={() => onIncrement(item.id)}
                        onDecrement={() => onDecrement(item.id)}
                    />
                    <div className={styles.actions}>
                        <button type="button" onClick={() => onSaveForLater(item.id)} className={styles.saveButton}>
                            Save for Later
                        </button>
                        <button type="button" onClick={() => onRemove(item.id)} className={styles.removeButton}>
                            Remove
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default CartItemCard;