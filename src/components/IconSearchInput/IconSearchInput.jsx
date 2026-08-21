import { MdSearch } from 'react-icons/md';
import styles from './IconSearchInput.module.css';

function IconSearchInput({ value, onChange, placeholder = 'Search...' }) {
    return (
        <div className={styles.wrapper}>
            <MdSearch size={26} className={styles.icon} />
            <input
                type="text"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder={placeholder}
                className={styles.input}
            />
        </div>
    );
}

export default IconSearchInput;