import styles from './ImageGalleryGrid.module.css';

function ImageGalleryGrid({ images, mobileColumns = 2, desktopColumns = 4, largeColumns }) {
  return (
    <div
      className={styles.grid}
      style={{
        '--gallery-mobile-cols': mobileColumns,
        '--gallery-desktop-cols': desktopColumns,
        '--gallery-large-cols': largeColumns || desktopColumns,
      }}
    >
      {images.map((image, index) => (
        <div key={index} className={styles.tile}>
          <img src={image.src} alt={image.alt} className={styles.image} />
        </div>
      ))}
    </div>
  );
}

export default ImageGalleryGrid;