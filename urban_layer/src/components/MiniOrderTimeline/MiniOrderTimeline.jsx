import { MdCheck, MdLocalShipping } from 'react-icons/md';
import styles from './MiniOrderTimeline.module.css';

const STEPS = [
    { key: 'ordered', label: 'Ordered', icon: MdCheck },
    { key: 'shipped', label: 'Shipped', icon: MdLocalShipping },
    { key: 'delivered', label: 'Delivered', icon: MdCheck },
];

function MiniOrderTimeline({ status }) {
    // status: 'processing' | 'shipped' | 'delivered'
    const currentIndex = status === 'delivered' ? 2 : status === 'shipped' ? 1 : 0;

    return (
        <div className={styles.wrapper}>
            <div className={styles.line} />
            <div className={styles.lineFill} style={{ width: `${(currentIndex / 2) * 100}%` }} />
            {STEPS.map((step, index) => {
                const isComplete = index <= currentIndex;
                return (
                    <div key={step.key} className={styles.step}>
                        <div className={isComplete ? `${styles.circle} ${styles.circleActive}` : styles.circle}>
                            {isComplete && <step.icon size={14} />}
                        </div>
                        <span className={isComplete ? `${styles.label} ${styles.labelActive}` : styles.label}>
                            {step.label}
                        </span>
                    </div>
                );
            })}
        </div>
    );
}

export default MiniOrderTimeline;