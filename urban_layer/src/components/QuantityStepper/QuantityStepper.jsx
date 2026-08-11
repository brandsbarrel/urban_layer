import { MdAdd, MdRemove } from 'react-icons/md';
import styles from './QuantityStepper.module.css';

function QuantityStepper({ quantity, onIncrement, onDecrement }) {
    return (
        <div className={styles.stepper}>
            <button
                type="button"
                onClick={onDecrement}
                disabled={quantity <= 1}
                className={styles.button}
                aria-label="Decrease quantity"
            >
                <MdRemove size={18} />
            </button>
            <span className={styles.value}>{quantity}</span>
            <button type="button" onClick={onIncrement} className={styles.button} aria-label="Increase quantity">
                <MdAdd size={18} />
            </button>
        </div>
    );
}

export default QuantityStepper;