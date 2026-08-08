import OrderSummaryLineItem from '../../../components/OrderSummaryLineItem/OrderSummaryLineItem';
import styles from './OrderItemsSection.module.css';

function OrderItemsSection({ items }) {
    return (
        <section className={styles.section}>
            <h3 className={styles.heading}>Order Items</h3>
            <div className={styles.grid}>
                {items.map((item) => (
                    <OrderSummaryLineItem
                        key={item.id}
                        variant="card"
                        image={item.image}
                        name={item.name}
                        subtitle={item.subtitle}
                        price={item.price * item.quantity}
                        quantity={item.quantity}
                    />
                ))}
            </div>
        </section>
    );
}

export default OrderItemsSection;