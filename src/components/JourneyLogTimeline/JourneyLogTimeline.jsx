import { MdCheck, MdLocalShipping } from 'react-icons/md';
import styles from './JourneyLogTimeline.module.css';

function JourneyLogTimeline({ steps }) {
    return (
        <div className={styles.wrapper}>
            <h3 className={styles.heading}>Journey Log</h3>
            <div className={styles.list}>
                {steps.map((step, index) => {
                    const isLast = index === steps.length - 1;
                    const isCompleted = step.status === 'completed';
                    const isCurrent = step.status === 'current';

                    return (
                        <div key={step.key} className={styles.item}>
                            {!isLast && (
                                <div
                                    className={
                                        isCompleted ? `${styles.connector} ${styles.connectorActive}` : styles.connector
                                    }
                                />
                            )}
                            <div
                                className={
                                    isCompleted || isCurrent
                                        ? `${styles.dot} ${styles.dotActive}`
                                        : styles.dot
                                }
                                style={isCurrent ? { boxShadow: '0 0 0 4px rgba(115, 92, 0, 0.15)' } : undefined}
                            >
                                {isCompleted && <MdCheck size={16} />}
                                {isCurrent && <MdLocalShipping size={16} />}
                            </div>
                            <div className={isCompleted || isCurrent ? undefined : styles.pendingText}>
                                <p className={styles.label}>{step.label}</p>
                                {step.timestamp && (
                                    <p className={isCurrent ? styles.timestampCurrent : styles.timestamp}>
                                        {step.timestamp}
                                    </p>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

export default JourneyLogTimeline;