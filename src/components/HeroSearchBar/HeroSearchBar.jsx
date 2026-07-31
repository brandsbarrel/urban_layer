import { MdSearch } from 'react-icons/md';
import styles from './HeroSearchBar.module.css';

function HeroSearchBar({ value, onChange, onSearch, placeholder = 'Search...' }) {
    const handleSubmit = (e) => {
        e.preventDefault();
        onSearch(value);
    };

    return (
        <form className={styles.wrapper} onSubmit={handleSubmit}>
            <MdSearch size={22} className={styles.icon} />
            <input
                type="text"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder={placeholder}
                className={styles.input}
            />
            <button type="submit" className={styles.button}>
                Search
            </button>
        </form>
    );
}

export default HeroSearchBar;