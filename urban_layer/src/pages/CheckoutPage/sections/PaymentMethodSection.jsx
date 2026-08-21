import { useState } from 'react';
import { MdRadioButtonUnchecked, MdRadioButtonChecked, MdCreditCard, MdLocalShipping, MdArrowForward } from 'react-icons/md';
import styles from './PaymentMethodSection.module.css';

const PAYMENT_METHODS = [
    {
        id: 'COD',
        label: 'Cash on Delivery',
        description: 'Pay when your order is delivered',
        icon: MdLocalShipping,
        badge: 'Popular',
        details: 'Available for orders up to ₹50,000',
    },
    {
        id: 'Online',
        label: 'Pay Online',
        description: 'UPI • Cards • Net Banking • Wallets',
        icon: MdCreditCard,
        badge: 'Secure',
        details: 'Powered by Razorpay - 256-bit SSL encryption',
    },
];

function PaymentMethodSection({ selectedMethod, onSelect }) {
    const [hoveredId, setHoveredId] = useState(null);

    return (
        <section className={styles.section}>
            <h2 className={styles.heading}>Payment Method</h2>
            <div className={styles.grid}>
                {PAYMENT_METHODS.map((method) => {
                    const isSelected = selectedMethod === method.id;
                    const Icon = method.icon;
                    return (
                        <button
                            key={method.id}
                            type="button"
                            className={`${styles.card} ${isSelected ? styles.selected : ''} ${hoveredId === method.id ? styles.hovered : ''}`}
                            onClick={() => onSelect(method.id)}
                            onMouseEnter={() => setHoveredId(method.id)}
                            onMouseLeave={() => setHoveredId(null)}
                        >
                            <div className={styles.radioWrapper}>
                                <div className={styles.radioOuter}>
                                    <div className={`${styles.radioInner} ${isSelected ? styles.radioInnerActive : ''}`} />
                                </div>
                            </div>
                            <div className={styles.content}>
                                <div className={styles.iconWrapper}>
                                    <Icon size={24} className={isSelected ? styles.iconActive : styles.icon} />
                                </div>
                                <div className={styles.text}>
                                    <div className={styles.labelRow}>
                                        <span className={styles.label}>{method.label}</span>
                                        {method.badge && <span className={styles.badge}>{method.badge}</span>}
                                    </div>
                                    <p className={styles.description}>{method.description}</p>
                                    <p className={styles.details}>{method.details}</p>
                                </div>
                            </div>
                            {isSelected && <MdRadioButtonChecked size={24} className={styles.checkIcon} />}
                        </button>
                    );
                })}
            </div>
            <p className={styles.secureNote}>
                <MdCreditCard size={16} /> Your payment is secured with 256-bit SSL encryption via Razorpay
            </p>
        </section>
    );
}

export default PaymentMethodSection;