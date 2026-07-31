import styles from './PillFilterGroup.module.css';

function PillFilterGroup({ title, options, selectedId, onSelect }) {
    return (
        <div className={styles.group}>
            {title && <h4 className={styles.title}>{title}</h4>}
            <div className={styles.pills}>
                {options.map((option) => (
                    <button
                        key={option.id}
                        type="button"
                        onClick={() => onSelect(option.id)}
                        className={option.id === selectedId ? `${styles.pill} ${styles.pillActive}` : styles.pill}
                    >
                        {option.label}
                    </button>
                ))}
            </div>
        </div>
    );
}

export default PillFilterGroup;