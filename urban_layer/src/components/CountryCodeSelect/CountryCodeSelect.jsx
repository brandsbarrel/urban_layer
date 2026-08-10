import { MdExpandMore } from 'react-icons/md';
import styles from './CountryCodeSelect.module.css';

const COUNTRY_CODES = [
    { value: '+91', label: '+91 IN' },
    { value: '+1', label: '+1 US' },
    { value: '+44', label: '+44 UK' },
    { value: '+33', label: '+33 FR' },
    { value: '+971', label: '+971 AE' },
];

function CountryCodeSelect({ value, onChange }) {
    return (
        <div className={styles.wrapper}>
            <select value={value} onChange={onChange} className={styles.select}>
                {COUNTRY_CODES.map((code) => (
                    <option key={code.value} value={code.value}>
                        {code.label}
                    </option>
                ))}
            </select>
            <MdExpandMore className={styles.icon} size={20} />
        </div>
    );
}

export default CountryCodeSelect;