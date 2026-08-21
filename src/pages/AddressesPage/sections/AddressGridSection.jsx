import AddressCard from '../../../components/AddressCard/AddressCard';
import AddNewAddressCard from '../../../components/AddNewAddressCard/AddNewAddressCard';
import styles from './AddressGridSection.module.css';

function AddressGridSection({ addresses, onEdit, onDelete, onSetDefault, onUseForCheckout, onAddNew }) {
    const sorted = [...addresses].sort((a, b) => (b.isDefault ? 1 : 0) - (a.isDefault ? 1 : 0));

    return (
        <section className={styles.grid}>
            {sorted.map((address) => (
                <AddressCard
                    key={address.id}
                    address={address}
                    onEdit={onEdit}
                    onDelete={onDelete}
                    onSetDefault={onSetDefault}
                    onUseForCheckout={onUseForCheckout}
                />
            ))}
            <AddNewAddressCard onClick={onAddNew} />
        </section>
    );
}

export default AddressGridSection;