import styles from './FeatureListItem.module.css';

function FeatureListItem({ icon: Icon, label }) {
    return (
        <div className={styles.item}>
            <div className={styles.iconCircle}>
                <Icon size={20} />
            </div>
            <p className={styles.label}>{label}</p>
        </div>
    );
}

export default FeatureListItem;