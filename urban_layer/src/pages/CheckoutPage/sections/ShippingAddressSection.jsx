import AddressManager from '../../../components/AddressManager/AddressManager';
import styles from './ShippingAddressSection.module.css';

function ShippingAddressSection() {
    return (
        <section>
            <h2 className={styles.heading}>Delivery Address</h2>
            <div className={styles.card}>
                <AddressManager title="Saved Addresses" selectable />
            </div>
        </section>
    );
}

export default ShippingAddressSection;
