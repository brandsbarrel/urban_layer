import { MdCheckCircle, MdEdit, MdDelete, MdPhoneIphone } from 'react-icons/md';
import styles from './AddressCard.module.css';

function AddressCard({ address, onEdit, onDelete, onSetDefault, onUseForCheckout }) {
    return (
        <div className={address.isDefault ? `${styles.card} ${styles.cardDefault}` : styles.card}>
            <div>
                <div className={styles.topRow}>
                    {address.isDefault ? (
                        <span className={styles.defaultBadge}>
                            <MdCheckCircle size={14} />
                            Default
                        </span>
                    ) : (
                        <span className={styles.badgePlaceholder} />
                    )}
                    <div className={styles.iconActions}>
                        <button type="button" onClick={() => onEdit(address)} className={styles.iconButton} aria-label="Edit address">
                            <MdEdit size={20} />
                        </button>
                        <button
                            type="button"
                            onClick={() => onDelete(address.id)}
                            className={styles.iconButtonDanger}
                            aria-label="Delete address"
                        >
                            <MdDelete size={20} />
                        </button>
                    </div>
                </div>

                <div className={styles.nameRow}>
                    <h3 className={styles.name}>{address.fullName}</h3>
                    <span className={styles.labelTag}>{address.label}</span>
                </div>

                <p className={styles.addressText}>
                    {address.street}
                    <br />
                    {address.city}, {address.state} - {address.pinCode}
                    <br />
                    India
                </p>

                <div className={styles.phoneRow}>
                    <MdPhoneIphone size={18} />
                    {address.phone}
                </div>
            </div>

            <div className={styles.footer}>
                {!address.isDefault && (
                    <button type="button" onClick={() => onSetDefault(address.id)} className={styles.setDefaultButton}>
                        Set as Default
                    </button>
                )}
                <button
                    type="button"
                    onClick={() => onUseForCheckout(address.id)}
                    className={address.isDefault ? styles.checkoutButtonPrimary : styles.checkoutButtonSecondary}
                >
                    Use for Checkout
                </button>
            </div>
        </div>
    );
}

export default AddressCard;