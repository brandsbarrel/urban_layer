import styles from './SectionHeading.module.css';

function SectionHeading({ title, underline = false }) {
    return (
        <div className={styles.wrapper}>
            <h2 className={styles.title}>{title}</h2>
            {underline && <div className={styles.underline} />}
        </div>
    );
}

export default SectionHeading;