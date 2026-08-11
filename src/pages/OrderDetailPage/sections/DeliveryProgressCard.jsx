import OrderProgressTimeline from '../../../components/OrderProgressTimeline/OrderProgressTimeline';
import styles from './DeliveryProgressCard.module.css';

function DeliveryProgressCard({ steps }) {
    return (
        <div className={styles.card}>
            <h4 className={styles.heading}>Delivery Progress</h4>
            <OrderProgressTimeline steps={steps} />
        </div>
    );
}

export default DeliveryProgressCard;