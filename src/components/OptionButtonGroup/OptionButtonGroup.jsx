import styles from './OptionButtonGroup.module.css';

function OptionButtonGroup({ label, options, selectedId, onSelect }) {
    return (
        <div className={styles.wrapper}>
            <label className={styles.label}>{label}</label>
            <div className={styles.grid}>
                {options.map((option) => (
                    <button
                        key={option.id}
                        type="button"
                        onClick={() => onSelect(option.id)}
                        className={
                            option.id === selectedId ? `${styles.option} ${styles.optionActive}` : styles.option
                        }
                    >
                        {option.label}
                    </button>
                ))}
            </div>
        </div>
    );
}

export default OptionButtonGroup;