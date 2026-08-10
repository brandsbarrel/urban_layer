import OrderStatusTimeline from '../../../components/OrderStatusTimeline/OrderStatusTimeline';
import styles from './OrderStatusSection.module.css';

function OrderStatusSection({ status, confirmedDate }) {
    return (
        <div className={styles.card}>
            <h3 className={styles.heading}>Order Status</h3>
            <OrderStatusTimeline currentStatus={status} confirmedDate={confirmedDate} />
        </div>
    );
}

export default OrderStatusSection;