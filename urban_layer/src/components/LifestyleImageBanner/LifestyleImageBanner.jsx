import styles from './LifestyleImageBanner.module.css';

function LifestyleImageBanner({ image, imageAlt, heading, description, height = 600 }) {
    return (
        <div className={styles.banner} style={{ height: `${height}px` }}>
            <img src={image} alt={imageAlt} className={styles.image} />
            <div className={styles.gradient} />
            <div className={styles.content}>
                <h2 className={styles.heading}>{heading}</h2>
                {description && <p className={styles.description}>{description}</p>}
            </div>
        </div>
    );
}

export default LifestyleImageBanner;