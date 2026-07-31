import ProductReviewCard from '../../../components/ProductReviewCard/ProductReviewCard';
import styles from './ProductReviewsSection.module.css';

function ProductReviewsSection({ reviews }) {
    return (
        <section className={styles.section}>
            <div className={styles.header}>
                <div>
                    <h2 className={styles.heading}>The Verdict</h2>
                    <p className={styles.subtitle}>Real stories from our global community.</p>
                </div>
                <button type="button" className={styles.writeReviewButton}>
                    Write a Review
                </button>
            </div>
            <div className={styles.grid}>
                {reviews.map((review) => (
                    <ProductReviewCard key={review.name} {...review} />
                ))}
            </div>
        </section>
    );
}

export default ProductReviewsSection;