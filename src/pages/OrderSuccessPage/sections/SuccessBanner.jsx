import AnimatedCheckmark from '../../../components/AnimatedCheckmark/AnimatedCheckmark';
import styles from './SuccessBanner.module.css';

function SuccessBanner({ orderId, estimatedDelivery }) {
    return (
        <section className={styles.section}>
            <AnimatedCheckmark />
            <h1 className={styles.heading}>Thank You for Your Order!</h1>
            <p className={styles.subtitle}>
                Your order <span className={styles.orderId}>#{orderId}</span> has been placed
                successfully and is now being processed. Expect delivery between{' '}
                <span className={styles.deliveryDate}>{estimatedDelivery}</span>.
            </p>
        </section>
    );
}

export default SuccessBanner;