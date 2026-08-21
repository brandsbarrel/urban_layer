import { useState } from 'react';
import { FaStar, FaRegStar, FaTimes, FaCheckCircle } from 'react-icons/fa';
import ProductReviewCard from '../../../components/ProductReviewCard/ProductReviewCard';
import styles from './ProductReviewsSection.module.css';

function ProductReviewsSection({ reviews = [] }) {
    const [reviewList, setReviewList] = useState(reviews);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [name, setName] = useState('');
    const [title, setTitle] = useState('');
    const [quote, setQuote] = useState('');
    const [rating, setRating] = useState(5);
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!name.trim() || !title.trim() || !quote.trim()) return;

        const newReview = {
            name,
            title,
            quote,
            rating: Number(rating),
        };

        setReviewList([newReview, ...reviewList]);
        setSubmitted(true);
        setTimeout(() => {
            setSubmitted(false);
            setIsModalOpen(false);
            setName('');
            setTitle('');
            setQuote('');
            setRating(5);
        }, 1500);
    };

    return (
        <section className={styles.section}>
            <div className={styles.header}>
                <div>
                    <h2 className={styles.heading}>The Verdict</h2>
                    <p className={styles.subtitle}>Real stories from our global community.</p>
                </div>
                <button
                    type="button"
                    onClick={() => setIsModalOpen(true)}
                    className={styles.writeReviewButton}
                >
                    Write a Review
                </button>
            </div>

            <div className={styles.grid}>
                {reviewList.map((review, index) => (
                    <ProductReviewCard key={review.name + index} {...review} />
                ))}
            </div>

            {isModalOpen && (
                <div className={styles.modalOverlay} onClick={() => setIsModalOpen(false)}>
                    <div className={styles.modalCard} onClick={(e) => e.stopPropagation()}>
                        <button
                            type="button"
                            className={styles.closeBtn}
                            onClick={() => setIsModalOpen(false)}
                            aria-label="Close"
                        >
                            <FaTimes size={18} />
                        </button>

                        {submitted ? (
                            <div className={styles.successBlock}>
                                <FaCheckCircle size={48} color="#22c55e" />
                                <h3>Thank you for your review!</h3>
                                <p>Your feedback has been published.</p>
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit} className={styles.form}>
                                <h3>Write a Customer Review</h3>
                                <div className={styles.formGroup}>
                                    <label>Your Rating</label>
                                    <div className={styles.starPicker}>
                                        {Array.from({ length: 5 }).map((_, i) => (
                                            <button
                                                key={i}
                                                type="button"
                                                onClick={() => setRating(i + 1)}
                                                className={styles.starBtn}
                                            >
                                                {i < rating ? <FaStar color="#f59e0b" size={22} /> : <FaRegStar color="#ccc" size={22} />}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div className={styles.formGroup}>
                                    <label>Your Name</label>
                                    <input
                                        type="text"
                                        required
                                        placeholder="e.g. Rahul Sharma"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        className={styles.input}
                                    />
                                </div>

                                <div className={styles.formGroup}>
                                    <label>Review Headline</label>
                                    <input
                                        type="text"
                                        required
                                        placeholder="e.g. Exceptional Quality & Fit"
                                        value={title}
                                        onChange={(e) => setTitle(e.target.value)}
                                        className={styles.input}
                                    />
                                </div>

                                <div className={styles.formGroup}>
                                    <label>Review Comments</label>
                                    <textarea
                                        rows={4}
                                        required
                                        placeholder="Share details of your experience with this product..."
                                        value={quote}
                                        onChange={(e) => setQuote(e.target.value)}
                                        className={styles.textarea}
                                    />
                                </div>

                                <button type="submit" className={styles.submitBtn}>
                                    Submit Review
                                </button>
                            </form>
                        )}
                    </div>
                </div>
            )}
        </section>
    );
}

export default ProductReviewsSection;