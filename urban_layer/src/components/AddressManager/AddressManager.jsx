import { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  MdAdd,
  MdDeleteOutline,
  MdEdit,
  MdLocationOn,
  MdRadioButtonChecked,
  MdRadioButtonUnchecked,
} from 'react-icons/md';
import {
  MAX_ADDRESSES,
  addAddressAsync,
  deleteAddressAsync,
  fetchAddresses,
  selectAddresses,
  selectAddressesError,
  selectAddressesStatus,
  selectSelectedCheckoutAddressId,
  setSelectedForCheckout,
  updateAddressAsync,
} from '../../redux/slices/addressesSlice';
import styles from './AddressManager.module.css';

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

const validateAddress = (values) => {
  const errors = {};
  if (!values.fullName.trim()) errors.fullName = 'Full name is required.';
  if (!values.street.trim()) errors.street = 'Street address is required.';
  if (!values.city.trim()) errors.city = 'City is required.';
  if (!values.state.trim()) errors.state = 'State is required.';
  if (!/^[1-9][0-9]{5}$/.test(values.pinCode.trim())) errors.pinCode = 'Enter a valid 6 digit PIN code.';
  if (values.phone.trim() && !/^\+?[0-9\s-]{7,15}$/.test(values.phone.trim())) {
    errors.phone = 'Enter a valid phone number.';
  }
  return errors;
};

function AddressSkeleton() {
  return (
    <div className={styles.skeletonGrid} aria-label="Loading addresses">
      {[0, 1].map((item) => (
        <div className={styles.skeletonCard} key={item}>
          <span className={`${styles.skeletonLine} ${styles.skeletonShort}`} />
          <span className={styles.skeletonLine} />
          <span className={styles.skeletonLine} />
          <span className={`${styles.skeletonLine} ${styles.skeletonMedium}`} />
        </div>
      ))}
    </div>
  );
}

function AddressForm({ initialValue, onCancel, onSubmit, isSaving }) {
  const [values, setValues] = useState(initialValue || EMPTY_FORM);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    setValues(initialValue || EMPTY_FORM);
    setErrors({});
  }, [initialValue]);

  const update = (field) => (event) => {
    setValues((current) => ({ ...current, [field]: event.target.value }));
    setErrors((current) => ({ ...current, [field]: '' }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const nextErrors = validateAddress(values);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;
    await onSubmit(values);
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit} noValidate>
      <div className={styles.formGrid}>
        <label className={styles.field}>
          <span className={styles.label}>Address Type</span>
          <input className={styles.input} value={values.label} onChange={update('label')} placeholder="Home" />
        </label>

        <label className={styles.field}>
          <span className={styles.label}>Full Name</span>
          <input className={styles.input} value={values.fullName} onChange={update('fullName')} placeholder="Aniket" />
          {errors.fullName && <span className={styles.errorText}>{errors.fullName}</span>}
        </label>

        <label className={`${styles.field} ${styles.fullWidth}`}>
          <span className={styles.label}>Street Address</span>
          <input className={styles.input} value={values.street} onChange={update('street')} placeholder="721 Fifth Avenue, Penthouse B" />
          {errors.street && <span className={styles.errorText}>{errors.street}</span>}
        </label>

        <label className={styles.field}>
          <span className={styles.label}>City</span>
          <input className={styles.input} value={values.city} onChange={update('city')} placeholder="Mumbai" />
          {errors.city && <span className={styles.errorText}>{errors.city}</span>}
        </label>

        <label className={styles.field}>
          <span className={styles.label}>State</span>
          <input className={styles.input} value={values.state} onChange={update('state')} placeholder="MH" />
          {errors.state && <span className={styles.errorText}>{errors.state}</span>}
        </label>

        <label className={styles.field}>
          <span className={styles.label}>PIN Code</span>
          <input className={styles.input} value={values.pinCode} onChange={update('pinCode')} placeholder="400001" inputMode="numeric" />
          {errors.pinCode && <span className={styles.errorText}>{errors.pinCode}</span>}
        </label>

        <label className={styles.field}>
          <span className={styles.label}>Phone</span>
          <input className={styles.input} value={values.phone} onChange={update('phone')} placeholder="+91 98765 43210" inputMode="tel" />
          {errors.phone && <span className={styles.errorText}>{errors.phone}</span>}
        </label>
      </div>

      <div className={styles.formActions}>
        <button type="button" className={styles.secondaryButton} onClick={onCancel}>
          Cancel
        </button>
        <button type="submit" className={styles.primaryButton} disabled={isSaving}>
          {isSaving ? 'Saving...' : 'Save Address'}
        </button>
      </div>
    </form>
  );
}

function AddressCard({ address, selectable, selected, onSelect, onEdit, onDelete }) {
  return (
    <article className={`${styles.card} ${selected ? styles.cardSelected : ''}`}>
      <div className={styles.cardHeader}>
        <div className={styles.cardTitle}>
          <MdLocationOn size={20} />
          <h3 className={styles.cardHeading}>{address.label || 'Address'}</h3>
        </div>
        {selectable && (
          <button type="button" className={styles.selectButton} onClick={onSelect}>
            {selected ? <MdRadioButtonChecked size={20} /> : <MdRadioButtonUnchecked size={20} />}
            <span>{selected ? 'Selected' : 'Select Address'}</span>
          </button>
        )}
      </div>

      <div className={styles.addressBody}>
        <p className={styles.name}>{address.fullName}</p>
        <p>{address.street}</p>
        <p>{address.city}, {address.state} - {address.pinCode}</p>
        {address.phone && <p>{address.phone}</p>}
      </div>

      <div className={styles.cardActions}>
        <button type="button" className={styles.textButton} onClick={onEdit}>
          <MdEdit size={18} />
          <span>Edit</span>
        </button>
        <button type="button" className={styles.dangerButton} onClick={onDelete}>
          <MdDeleteOutline size={18} />
          <span>Delete</span>
        </button>
      </div>
    </article>
  );
}

function AddressManager({ title = 'Saved Addresses', selectable = false }) {
  const dispatch = useDispatch();
  const addresses = useSelector(selectAddresses);
  const status = useSelector(selectAddressesStatus);
  const error = useSelector(selectAddressesError);
  const selectedId = useSelector(selectSelectedCheckoutAddressId);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingAddress, setEditingAddress] = useState(null);
  const [localMessage, setLocalMessage] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const isLoading = status === 'idle' || status === 'loading';
  const canAdd = addresses.length < MAX_ADDRESSES;
  const formInitialValue = useMemo(() => editingAddress || EMPTY_FORM, [editingAddress]);

  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchAddresses());
    }
  }, [dispatch, status]);

  const openAddForm = () => {
    if (!canAdd) {
      setLocalMessage(`You can save a maximum of ${MAX_ADDRESSES} addresses.`);
      return;
    }
    setLocalMessage('');
    setEditingAddress(null);
    setIsFormOpen(true);
  };

  const handleSubmit = async (values) => {
    setIsSaving(true);
    setLocalMessage('');
    const action = editingAddress
      ? updateAddressAsync({ ...editingAddress, ...values })
      : addAddressAsync(values);
    const result = await dispatch(action);
    setIsSaving(false);
    if (result.meta.requestStatus === 'fulfilled') {
      setIsFormOpen(false);
      setEditingAddress(null);
    }
  };

  const handleEdit = (address) => {
    setLocalMessage('');
    setEditingAddress(address);
    setIsFormOpen(true);
  };

  const handleDelete = (id) => {
    const confirmed = window.confirm('Delete this address?');
    if (confirmed) {
      dispatch(deleteAddressAsync(id));
      setLocalMessage('Address deleted.');
    }
  };

  return (
    <section className={styles.manager}>
      <div className={styles.header}>
        <h2 className={styles.heading}>{title}</h2>
        {!isLoading && addresses.length > 0 && canAdd && (
          <button type="button" className={styles.addButton} onClick={openAddForm}>
            <MdAdd size={20} />
            <span>Add Address</span>
          </button>
        )}
      </div>

      {isLoading && <AddressSkeleton />}

      {!isLoading && status === 'failed' && (
        <div className={styles.emptyState}>
          <p>{error || 'Something went wrong.'}</p>
          <button type="button" className={styles.primaryButton} onClick={() => dispatch(fetchAddresses())}>
            Retry
          </button>
        </div>
      )}

      {!isLoading && status !== 'failed' && addresses.length === 0 && !isFormOpen && (
        <div className={styles.emptyState}>
          <p>No Address Found</p>
          <button type="button" className={styles.addButton} onClick={openAddForm}>
            <MdAdd size={20} />
            <span>Add Address</span>
          </button>
        </div>
      )}

      {!isLoading && addresses.length > 0 && (
        <div className={styles.list}>
          {addresses.map((address) => (
            <AddressCard
              key={address.id}
              address={address}
              selectable={selectable}
              selected={selectedId === address.id}
              onSelect={() => dispatch(setSelectedForCheckout(address.id))}
              onEdit={() => handleEdit(address)}
              onDelete={() => handleDelete(address.id)}
            />
          ))}
        </div>
      )}

      {!isLoading && !canAdd && !isFormOpen && (
        <p className={styles.limitMessage}>You can save a maximum of {MAX_ADDRESSES} addresses.</p>
      )}

      {(localMessage || error) && !isLoading && (
        <p className={styles.message}>{localMessage || error}</p>
      )}

      {isFormOpen && (
        <AddressForm
          initialValue={formInitialValue}
          onSubmit={handleSubmit}
          onCancel={() => {
            setIsFormOpen(false);
            setEditingAddress(null);
          }}
          isSaving={isSaving}
        />
      )}

      {!isLoading && addresses.length > 0 && canAdd && !isFormOpen && (
        <button type="button" className={`${styles.addButton} ${styles.bottomAddButton}`} onClick={openAddForm}>
          <MdAdd size={20} />
          <span>Add Address</span>
        </button>
      )}
    </section>
  );
}

export default AddressManager;
