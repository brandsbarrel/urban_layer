import { MdInfo, MdSecurity, MdLocalShipping } from 'react-icons/md';
import AddressTipItem from '../../../components/AddressTipItem/AddressTipItem';
import styles from './AddressTipsSection.module.css';

const TIPS = [
    {
        icon: MdInfo,
        text: 'Set a default address to skip the shipping step during your next high-speed drop purchase.',
    },
    {
        icon: MdSecurity,
        text: 'Your address data is encrypted and stored securely following our global privacy standards.',
    },
    {
        icon: MdLocalShipping,
        text: 'Make sure to provide a valid phone number to ensure successful delivery by our premium couriers.',
    },
];

function AddressTipsSection() {
    return (
        <section className={styles.section}>
            <h4 className={styles.heading}>Address Management Tips</h4>
            <div className={styles.grid}>
                {TIPS.map((tip) => (
                    <AddressTipItem key={tip.text} icon={tip.icon} text={tip.text} />
                ))}
            </div>
        </section>
    );
}

export default AddressTipsSection;