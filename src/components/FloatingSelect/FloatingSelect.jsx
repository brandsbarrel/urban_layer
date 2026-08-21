import { MdExpandMore } from 'react-icons/md';
import styles from './FloatingSelect.module.css';

function FloatingSelect({ id, label, value, onChange, options }) {
    return (
        <div className={styles.group}>
            <label htmlFor={id} className={styles.label}>
                {label}
            </label>
            <div className={styles.selectWrapper}>
                <select id={id} value={value} onChange={onChange} className={styles.select}>
                    {options.map((option) => (
                        <option key={option.value} value={option.value}>
                            {option.label}
                        </option>
                    ))}
                </select>
                <MdExpandMore size={18} className={styles.icon} />
            </div>
        </div>
    );
}

export default FloatingSelect;