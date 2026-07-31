import styles from './PriceRangeFilter.module.css';

function PriceRangeFilter({ min, max, value, onChange }) {
    return (
        <div className={styles.group}>
            <h3 className={styles.title}>Price Range</h3>
            <input
                type="range"
                min={min}
                max={max}
                value={value}
                onChange={(e) => onChange(Number(e.target.value))}
                className={styles.slider}
            />
            <div className={styles.labels}>
                <span>₹{min}</span>
                <span>
                    {value >= max ? `₹${max}+` : `Up to ₹${value.toLocaleString('en-IN')}`}
                </span>
            </div>
        </div>
    );
}

export default PriceRangeFilter;