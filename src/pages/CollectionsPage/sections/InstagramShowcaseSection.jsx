import ImageGalleryGrid from '../../../components/ImageGalleryGrid/ImageGalleryGrid';
import { instagramImages } from '../../../services/collectionsPageData';
import styles from './InstagramShowcaseSection.module.css';

function InstagramShowcaseSection() {
    return (
        <section className={styles.section}>
            <div className={styles.container}>
                <h2 className={styles.heading}>@urbanlayers_co</h2>
                <ImageGalleryGrid images={instagramImages} mobileColumns={3} desktopColumns={6} />
                <a
                    href="https://instagram.com/urbanlayers_co"
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.followButton}
                >
                    Follow Our Journey
                </a>
            </div>
        </section>
    );
}

export default InstagramShowcaseSection;