import styles from './SearchChipList.module.css';

function SearchChipList({ label = 'Recent Searches:', chips, onChipClick }) {
    return (
        <div className={styles.wrapper}>
            <span className={styles.label}>{label}</span>
            {chips.map((chip) => (
                <button
                    key={chip}
                    type="button"
                    onClick={() => onChipClick(chip)}
                    className={styles.chip}
                >
                    {chip}
                </button>
            ))}
        </div>
    );
}

export default SearchChipList;