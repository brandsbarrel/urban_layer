import styles from './PriceBreakdownList.module.css';

function PriceBreakdownList({ lines, total, totalLabel = 'Total' }) {
    return (
        <div className={styles.wrapper}>
            <div className={styles.lines}>
                {lines.map((line) => (
                    <div key={line.label} className={styles.line}>
                        <span>{line.label}</span>
                        <span className={line.highlight ? styles.highlight : undefined}>{line.value}</span>
                    </div>
                ))}
            </div>
            <div className={styles.totalRow}>
                <span>{totalLabel}</span>
                <span>{total}</span>
            </div>
        </div>
    );
}

export default PriceBreakdownList;