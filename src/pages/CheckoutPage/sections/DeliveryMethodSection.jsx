import ShippingMethodCard from '../../../components/ShippingMethodCard/ShippingMethodCard';
import styles from './DeliveryMethodSection.module.css';

const METHODS = [
    {
        id: 'standard',
        label: 'Standard Shipping',
        priceLabel: 'Free',
        estimatedDelivery: 'Oct 24 - Oct 26',
    },
    {
        id: 'express',
        label: 'Express Courier',
        priceLabel: '₹499',
        estimatedDelivery: 'Oct 21 - Oct 22',
    },
];

function DeliveryMethodSection({ selectedMethod, onSelect }) {
    return (
        <section>
            <h2 className={styles.heading}>Delivery Method</h2>
            <div className={styles.grid}>
                {METHODS.map((method) => (
                    <ShippingMethodCard
                        key={method.id}
                        id={method.id}
                        name="shipping"
                        label={method.label}
                        priceLabel={method.priceLabel}
                        estimatedDelivery={method.estimatedDelivery}
                        selected={selectedMethod === method.id}
                        onSelect={onSelect}
                    />
                ))}
            </div>
        </section>
    );
}

export default DeliveryMethodSection;