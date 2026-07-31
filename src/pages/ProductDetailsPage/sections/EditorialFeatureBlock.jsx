import styles from './EditorialFeatureBlock.module.css';

function EditorialFeatureBlock({ image, imageAlt, eyebrow, heading, description, imagePosition = 'left' }) {
    return (
        <div className={styles.block}>
            <div className={imagePosition === 'right' ? styles.imageWrapperRight : styles.imageWrapper}>
                <img src={image} alt={imageAlt} className={styles.image} />
            </div>
            <div className={imagePosition === 'right' ? styles.textWrapperRight : styles.textWrapper}>
                <span className={styles.eyebrow}>{eyebrow}</span>
                <h2 className={styles.heading}>{heading}</h2>
                <p className={styles.description}>{description}</p>
            </div>
        </div>
    );
}

export default EditorialFeatureBlock;