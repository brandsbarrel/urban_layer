import { MdCheck, MdSync, MdLocalShipping, MdHome } from 'react-icons/md';
import styles from './OrderStatusTimeline.module.css';

const STEPS = [
    { key: 'confirmed', label: 'Confirmed', icon: MdCheck },
    { key: 'processing', label: 'Processing', icon: MdSync },
    { key: 'shipped', label: 'Shipped', icon: MdLocalShipping },
    { key: 'delivered', label: 'Delivered', icon: MdHome },
];

function OrderStatusTimeline({ currentStatus, confirmedDate }) {
    const currentIndex = STEPS.findIndex((step) => step.key === currentStatus);

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