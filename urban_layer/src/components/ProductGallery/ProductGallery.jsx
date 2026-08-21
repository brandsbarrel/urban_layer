import { useEffect, useState } from 'react';
import { MdClose, MdZoomIn } from 'react-icons/md';
import styles from './ProductGallery.module.css';

function ProductGallery({ heroImage, thumbnails = [], badge, productName }) {
    const [activeImage, setActiveImage] = useState(heroImage);
    const [activeThumbIndex, setActiveThumbIndex] = useState(0);
    const [isZoomOpen, setIsZoomOpen] = useState(false);

    useEffect(() => {
        setActiveImage(heroImage);
        setActiveThumbIndex(0);
    }, [heroImage]);

    const handleThumbClick = (thumb, index) => {
        setActiveImage(thumb.src);
        setActiveThumbIndex(index);
    };

    return (
        <div className={styles.gallery}>
            {thumbnails.length > 0 && (
                <div className={styles.thumbRail}>
                    {thumbnails.map((thumb, index) => (
                        <button
                            key={thumb.src + index}
                            type="button"
                            onClick={() => handleThumbClick(thumb, index)}
                            className={
                                index === activeThumbIndex ? `${styles.thumb} ${styles.thumbActive}` : styles.thumb
                            }
                        >
                            <img src={thumb.src} alt={thumb.alt || productName} className={styles.thumbImage} />
                        </button>
                    ))}
                </div>
            )}

            <div className={styles.mainWrapper} onClick={() => setIsZoomOpen(true)}>
                <img src={activeImage} alt={productName} className={styles.mainImage} />
                {badge && (
                    <div className={styles.badgeWrapper}>
                        <span className={styles.badge}>{badge}</span>
                    </div>
                )}
                <button type="button" className={styles.zoomHint} aria-label="Zoom Image">
                    <MdZoomIn size={22} />
                </button>
            </div>

            {isZoomOpen && (
                <div className={styles.modalOverlay} onClick={() => setIsZoomOpen(false)}>
                    <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
                        <button
                            type="button"
                            className={styles.closeButton}
                            onClick={() => setIsZoomOpen(false)}
                            aria-label="Close Zoom Modal"
                        >
                            <MdClose size={24} />
                        </button>
                        <img src={activeImage} alt={productName} className={styles.zoomedImage} />
                    </div>
                </div>
            )}
        </div>
    );
}

export default ProductGallery;