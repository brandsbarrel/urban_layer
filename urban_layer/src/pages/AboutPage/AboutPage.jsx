import NewsletterSignup from '../../components/NewsletterSignup/NewsletterSignup';
import ImageGalleryGrid from '../../components/ImageGalleryGrid/ImageGalleryGrid';
import AboutHero from './sections/AboutHero';
import BrandStorySection from './sections/BrandStorySection';
import MissionVisionSection from './sections/MissionVisionSection';
import CoreValuesSection from './sections/CoreValuesSection';
import TimelineSection from './sections/TimelineSection';
import CraftsmanshipSection from './sections/CraftsmanshipSection';
import AchievementsSection from './sections/AchievementsSection';
import TestimonialsSection from './sections/TestimonialsSection';
import AboutClosingBanner from './sections/AboutClosingBanner';
import { galleryImages } from '../../services/aboutPageData';
import styles from './AboutPage.module.css';

function AboutPage() {
  return (
    <div className={styles.page}>
      <AboutHero />
      <BrandStorySection />
      <MissionVisionSection />
      <CoreValuesSection />
      <TimelineSection />
      <CraftsmanshipSection />
      <AchievementsSection />
      <TestimonialsSection />
      <div className={styles.gallerySection}>
        <ImageGalleryGrid images={galleryImages} />
      </div>
      <div className={styles.newsletterSection}>
        <NewsletterSignup />
      </div>
      <AboutClosingBanner />
    </div>
  );
}

export default AboutPage;
