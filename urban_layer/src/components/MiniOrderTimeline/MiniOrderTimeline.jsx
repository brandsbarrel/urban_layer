import { MdCheck, MdLocalShipping, MdFactory, MdInventory2 } from 'react-icons/md';
import styles from './MiniOrderTimeline.module.css';

// Order lifecycle steps matching backend statuses
const STEPS = [
    { key: 'pending', label: 'Ordered', icon: MdCheck },
    { key: 'confirmed', label: 'Confirmed', icon: MdCheck },
    { key: 'processing', label: 'Processing', icon: MdFactory },
    { key: 'packed', label: 'Packed', icon: MdInventory2 },
    { key: 'shipped', label: 'Shipped', icon: MdLocalShipping },
    { key: 'out_for_delivery', label: 'Out for Delivery', icon: MdLocalShipping },
    { key: 'delivered', label: 'Delivered', icon: MdCheck },
];

// Map backend status to step index
const STATUS_TO_INDEX = {
    'pending': 0,
    'confirmed': 1,
    'processing': 2,
    'packed': 3,
    'shipped': 4,
    'out for delivery': 5,
    'delivered': 6,
    'cancelled': -1,
};

function MiniOrderTimeline({ status }) {
    // Normalize status to lowercase for mapping
    const normalizedStatus = (status || 'pending').toLowerCase();
    const currentIndex = STATUS_TO_INDEX[normalizedStatus] ?? 0;

    return (
        <div className={styles.wrapper}>
            <div className={styles.line} />
            <div className={styles.lineFill} style={{ width: `${currentIndex / (STEPS.length - 1) * 100}%` }} />
            {STEPS.map((step, index) => {
                const isComplete = index <= currentIndex && currentIndex >= 0;
                const isCurrent = index === currentIndex && currentIndex >= 0;
                return (
                    <div key={step.key} className={styles.step}>
                        <div className={
                            isComplete ? `${styles.circle} ${styles.circleActive}` :
                            isCurrent ? `${styles.circle} ${styles.circleCurrent}` :
                            styles.circle
                        }>
                            {isComplete && <step.icon size={14} />}
                        </div>
                        <span className={
                            isComplete ? `${styles.label} ${styles.labelActive}` :
                            isCurrent ? `${styles.label} ${styles.labelCurrent}` :
                            styles.label
                        }>
                            {step.label}
                        </span>
                    </div>
                );
            })}
        </div>
    );
}

export default MiniOrderTimeline;