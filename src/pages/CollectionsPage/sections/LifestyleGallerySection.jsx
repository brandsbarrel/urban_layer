import ImageGalleryGrid from '../../../components/ImageGalleryGrid/ImageGalleryGrid';
import { lifestyleImages } from '../../../services/collectionsPageData';
import styles from './LifestyleGallerySection.module.css';

function LifestyleGallerySection() {
    return (
        <section className={styles.section}>
            <h2 className={styles.heading}>Life in Layers</h2>
            <ImageGalleryGrid images={lifestyleImages} mobileColumns={2} desktopColumns={4} />
        </section>
    );
}

export default LifestyleGallerySection;