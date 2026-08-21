import { useEffect, useState } from 'react';
import { MdClose } from 'react-icons/md';
import styles from './AddressFormModal.module.css';

const LABEL_OPTIONS = ['Home', 'Office', 'Other'];

const EMPTY_FORM = {
    label: 'Home',
    fullName: '',
    street: '',
    city: '',
    state: '',
    pinCode: '',
    phone: '',
    isDefault: false,
};

function AddressFormModal({ isOpen, mode = 'add', initialData, onClose, onSubmit }) {
    const [formData, setFormData] = useState(EMPTY_FORM);

    useEffect(() => {
        if (isOpen) {
            setFormData(initialData ? { ...EMPTY_FORM, ...initialData } : EMPTY_FORM);
        }
    }, [isOpen, initialData]);

    if (!isOpen) return null;

    const handleChange = (field) => (e) => {
        const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
        setFormData((prev) => ({ ...prev, [field]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(formData);
    };

    return (
        <div className={styles.overlay} onClick={onClose}>
            <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
                <div className={styles.header}>
                    <h2 className={styles.heading}>{mode === 'edit' ? 'Edit Address' : 'Add New Address'}</h2>
                    <button type="button" onClick={onClose} className={styles.closeButton} aria-label="Close">
                        <MdClose size={22} />
                    </button>
                </div>

                <form className={styles.form} onSubmit={handleSubmit}>
                    <div className={styles.field}>
                        <label className={styles.label}>Address Type</label>
                        <div className={styles.labelOptions}>
                            {LABEL_OPTIONS.map((option) => (
                                <button
                                    key={option}
                                    type="button"
                                    onClick={() => setFormData((prev) => ({ ...prev, label: option }))}
                                    className={
                                        formData.label === option
                                            ? `${styles.labelChip} ${styles.labelChipActive}`
                                            : styles.labelChip
                                    }
                                >
                                    {option}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className={styles.field}>
                        <label className={styles.label} htmlFor="fullName">
                            Full Name
                        </label>
                        <input
                            id="fullName"
                            type="text"
                            value={formData.fullName}
                            onChange={handleChange('fullName')}
                            placeholder="Aniket Sharma"
                            required
                            className={styles.input}
                        />
                    </div>

                    <div className={styles.field}>
                        <label className={styles.label} htmlFor="street">
                            Street Address
                        </label>
                        <input
                            id="street"
                            type="text"
                            value={formData.street}
                            onChange={handleChange('street')}
                            placeholder="Apartment, street, area"
                            required
                            className={styles.input}
                        />
                    </div>

                    <div className={styles.row}>
                        <div className={styles.field}>
                            <label className={styles.label} htmlFor="city">
                                City
                            </label>
                            <input
                                id="city"
                                type="text"
                                value={formData.city}
                                onChange={handleChange('city')}
                                placeholder="Gurugram"
                                required
                                className={styles.input}
                            />
                        </div>
                        <div className={styles.field}>
                            <label className={styles.label} htmlFor="state">
                                State
                            </label>
                            <input
                                id="state"
                                type="text"
                                value={formData.state}
                                onChange={handleChange('state')}
                                placeholder="Haryana"
                                required
                                className={styles.input}
                            />
                        </div>
                    </div>

                    <div className={styles.row}>
                        <div className={styles.field}>
                            <label className={styles.label} htmlFor="pinCode">
                                PIN Code
                            </label>
                            <input
                                id="pinCode"
                                type="text"
                                value={formData.pinCode}
                                onChange={handleChange('pinCode')}
                                placeholder="122011"
                                required
                                className={styles.input}
                            />
                        </div>
                        <div className={styles.field}>
                            <label className={styles.label} htmlFor="phone">
                                Phone Number
                            </label>
                            <input
                                id="phone"
                                type="tel"
                                value={formData.phone}
                                onChange={handleChange('phone')}
                                placeholder="+91 98765 43210"
                                required
                                className={styles.input}
                            />
                        </div>
                    </div>

                    <label className={styles.checkboxRow}>
                        <input
                            type="checkbox"
                            checked={formData.isDefault}
                            onChange={handleChange('isDefault')}
                            className={styles.checkbox}
                        />
                        <span>Set as default address</span>
                    </label>

                    <div className={styles.actions}>
                        <button type="button" onClick={onClose} className={styles.cancelButton}>
                            Cancel
                        </button>
                        <button type="submit" className={styles.saveButton}>
                            {mode === 'edit' ? 'Save Changes' : 'Save Address'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default AddressFormModal;