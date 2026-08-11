import { MdChevronLeft, MdChevronRight } from 'react-icons/md';
import TestimonialCard from '../../../components/TestimonialCard/TestimonialCard';
import { communityReviews } from '../../../services/accessoriesPageData';
import styles from './CommunityReviewsSection.module.css';

function CommunityReviewsSection() {
    return (
        <section className={styles.section}>
            <div className={styles.header}>
                <h2 className={styles.heading}>What Our Community Says</h2>
                <div className={styles.arrows}>
                    <button className={styles.arrowButton} aria-label="Previous">
                        <MdChevronLeft size={22} />
                    </button>
                    <button className={styles.arrowButton} aria-label="Next">
                        <MdChevronRight size={22} />
                    </button>
                </div>
            </div>
            <div className={styles.grid}>
                {communityReviews.map((review) => (
                    <TestimonialCard key={review.name} {...review} />
                ))}
            </div>
        </section>
    );
}

export default CommunityReviewsSection;