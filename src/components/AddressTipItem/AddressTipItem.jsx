import styles from './AddressTipItem.module.css';

function AddressTipItem({ icon: Icon, text }) {
    return (
        <div className={styles.item}>
            <Icon size={22} className={styles.icon} />
            <p className={styles.text}>{text}</p>
        </div>
    );
}

export default AddressTipItem;