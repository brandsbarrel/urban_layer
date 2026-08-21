import { MdAdd } from 'react-icons/md';
import styles from './AddNewAddressCard.module.css';

function AddNewAddressCard({ onClick }) {
    return (
        <button type="button" onClick={onClick} className={styles.card}>
            <div className={styles.iconCircle}>
                <MdAdd size={32} />
            </div>
            <h3 className={styles.heading}>Add New Address</h3>
            <p className={styles.subtitle}>Save a new location for faster deliveries.</p>
        </button>
    );
}

export default AddNewAddressCard;