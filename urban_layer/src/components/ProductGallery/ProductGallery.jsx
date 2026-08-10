import { useState } from 'react';
import styles from './ProductGallery.module.css';

function ProductGallery({ heroImage, thumbnails, badge, productName }) {
    const [activeImage, setActiveImage] = useState(heroImage);
    const [activeThumbIndex, setActiveThumbIndex] = useState(0);

    const handleThumbClick = (thumb, index) => {
        setActiveImage(thumb.src);
        setActiveThumbIndex(index);
    };

    return (
        <div className={styles.gallery}>
            <div className={styles.thumbRail}>
                {thumbnails.map((thumb, index) => (
                    <button
                        key={thumb.src}
                        type="button"
                        onClick={() => handleThumbClick(thumb, index)}
                        className={
                            index === activeThumbIndex ? `${styles.thumb} ${styles.thumbActive}` : styles.thumb
                        }
                    >
                        <img src={thumb.src} alt={thumb.alt} className={styles.thumbImage} />
                    </button>
                ))}
            </div>
            <div className={styles.mainWrapper}>
                <img src={activeImage} alt={productName} className={styles.mainImage} />
                {badge && (
                    <div className={styles.badgeWrapper}>
                        <span className={styles.badge}>{badge}</span>
                    </div>
                )}
            </div>
        </div>
    );
}

export default ProductGallery;