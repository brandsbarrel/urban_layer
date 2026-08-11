import { MdCheck } from 'react-icons/md';
import styles from './OrderProgressTimeline.module.css';

function OrderProgressTimeline({ steps }) {
    return (
        <div className={styles.list}>
            {steps.map((step, index) => {
                const isLast = index === steps.length - 1;
                const isCompleted = step.status === 'completed';
                const isCurrent = step.status === 'current';

                return (
                    <div key={step.key} className={styles.item}>
                        {!isLast && <div className={styles.connector} />}

                        {isCompleted && (
                            <div className={styles.dotCompleted}>
                                <MdCheck size={12} />
                            </div>
                        )}
                        {isCurrent && (
                            <div className={styles.dotCurrentWrapper}>
                                <div className={styles.dotCurrent} />
                            </div>
                        )}
                        {!isCompleted && !isCurrent && <div className={styles.dotPending} />}

                        <div className={isCompleted || isCurrent ? undefined : styles.pendingText}>
                            <p className={isCurrent ? styles.labelCurrent : styles.label}>{step.label}</p>
                            <p className={isCurrent ? styles.dateCurrent : styles.date}>{step.dateLabel}</p>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}

export default OrderProgressTimeline;