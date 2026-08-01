import { MdCheck } from 'react-icons/md';
import styles from './CheckoutStepper.module.css';

const STEPS = [
    { number: 1, label: 'Shipping' },
    { number: 2, label: 'Delivery' },
    { number: 3, label: 'Payment' },
];

function CheckoutStepper({ currentStep }) {
    const progressPercent = ((currentStep - 1) / (STEPS.length - 1)) * 100;

    return (
        <div className={styles.wrapper}>
            <div className={styles.track}>
                <div className={styles.line} />
                <div className={styles.lineFill} style={{ width: `${progressPercent}%` }} />

                {STEPS.map((step) => {
                    const isCompleted = step.number < currentStep;
                    const isActive = step.number === currentStep;
                    return (
                        <div key={step.number} className={styles.step}>
                            <div
                                className={
                                    isActive || isCompleted
                                        ? `${styles.circle} ${styles.circleActive}`
                                        : styles.circle
                                }
                            >
                                {isCompleted ? <MdCheck size={18} /> : step.number}
                            </div>
                            <span className={isActive ? `${styles.label} ${styles.labelActive}` : styles.label}>
                                {step.label}
                            </span>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

export default CheckoutStepper;