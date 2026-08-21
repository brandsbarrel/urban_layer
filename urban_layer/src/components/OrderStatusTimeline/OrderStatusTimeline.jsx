import { MdCheck, MdSync, MdLocalShipping, MdHome, MdFactory, MdInventory2 } from 'react-icons/md';
import styles from './OrderStatusTimeline.module.css';

// Order lifecycle steps matching backend statuses
const STEPS = [
    { key: 'pending', label: 'Order Placed', icon: MdCheck },
    { key: 'confirmed', label: 'Confirmed', icon: MdCheck },
    { key: 'processing', label: 'Processing', icon: MdFactory },
    { key: 'packed', label: 'Packed', icon: MdInventory2 },
    { key: 'shipped', label: 'Shipped', icon: MdLocalShipping },
    { key: 'out_for_delivery', label: 'Out for Delivery', icon: MdLocalShipping },
    { key: 'delivered', label: 'Delivered', icon: MdHome },
];

function OrderStatusTimeline({ currentStatus, confirmedDate }) {
    const normalizedStatus = (currentStatus || 'pending').toLowerCase();
    const currentIndex = STEPS.findIndex((step) => step.key === normalizedStatus);

    return (
        <div className={styles.wrapper}>
            <div className={styles.line} />
            {STEPS.map((step, index) => {
                const isCompleted = index < currentIndex;
                const isCurrent = index === currentIndex;
                const Icon = isCompleted ? MdCheck : step.icon;

                return (
                    <div key={step.key} className={styles.step}>
                        <div
                            className={
                                isCompleted
                                    ? `${styles.circle} ${styles.circleCompleted}`
                                    : isCurrent
                                        ? `${styles.circle} ${styles.circleCurrent}`
                                        : styles.circle
                            }
                        >
                            <Icon size={20} />
                        </div>
                        <span
                            className={
                                isCompleted || isCurrent ? `${styles.label} ${styles.labelActive}` : styles.label
                            }
                        >
                            {step.label}
                        </span>
                        {step.key === 'confirmed' && confirmedDate && (
                            <span className={styles.date}>{confirmedDate}</span>
                        )}
                    </div>
                );
            })}
        </div>
    );
}

export default OrderStatusTimeline;