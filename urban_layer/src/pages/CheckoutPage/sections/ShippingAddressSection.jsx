import LabeledInput from '../../../components/LabeledInput/LabeledInput';
import styles from './ShippingAddressSection.module.css';

function ShippingAddressSection({ address, onChange }) {
    const update = (field) => (e) => onChange({ ...address, [field]: e.target.value });

    return (
        <section>
            <h2 className={styles.heading}>Shipping Address</h2>
            <div className={styles.card}>
                <div className={styles.grid}>
                    <div className={styles.fullWidth}>
                        <LabeledInput
                            label="Full Name"
                            value={address.fullName}
                            onChange={update('fullName')}
                            placeholder="Alexander Sterling"
                        />
                    </div>
                    <div className={styles.fullWidth}>
                        <LabeledInput
                            label="Street Address"
                            value={address.street}
                            onChange={update('street')}
                            placeholder="721 Fifth Avenue, Penthouse B"
                        />
                    </div>
                    <LabeledInput
                        label="City"
                        value={address.city}
                        onChange={update('city')}
                        placeholder="Mumbai"
                    />
                    <div className={styles.stateZipRow}>
                        <LabeledInput
                            label="State"
                            value={address.state}
                            onChange={update('state')}
                            placeholder="MH"
                        />
                        <LabeledInput
                            label="PIN Code"
                            value={address.pinCode}
                            onChange={update('pinCode')}
                            placeholder="400001"
                        />
                    </div>
                </div>
            </div>
        </section>
    );
}

export default ShippingAddressSection;