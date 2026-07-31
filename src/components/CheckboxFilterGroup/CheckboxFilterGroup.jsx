import styles from './CheckboxFilterGroup.module.css';

function CheckboxFilterGroup({ title, options, selectedIds, onToggle }) {
    return (
        <div className={styles.group}>
            <h3 className={styles.title}>{title}</h3>
            <div className={styles.options}>
                {options.map((option) => (
                    <label key={option.id} className={styles.option}>
                        <input
                            type="checkbox"
                            checked={selectedIds.includes(option.id)}
                            onChange={() => onToggle(option.id)}
                            className={styles.checkbox}
                        />
                        <span>{option.label}</span>
                    </label>
                ))}
            </div>
        </div>
    );
}

export default CheckboxFilterGroup;