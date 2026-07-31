import { useRef } from 'react';
import { MdArrowBack, MdArrowForward } from 'react-icons/md';
import RecommendationCard from '../../../components/RecommendationCard/RecommendationCard';
import { recommendedProducts } from '../../../services/shopPageData';
import styles from './RecommendationsSlider.module.css';

function RecommendationsSlider() {
    const scrollRef = useRef(null);

    const scroll = (direction) => {
        scrollRef.current?.scrollBy({ left: direction === 'left' ? -300 : 300, behavior: 'smooth' });
    };

    return (
        <section className={styles.section}>
            <div className={styles.header}>
                <div>
                    <span className={styles.eyebrow}>Personalized</span>
                    <h2 className={styles.heading}>You May Also Like</h2>
                </div>
                <div className={styles.arrows}>
                    <button onClick={() => scroll('left')} className={styles.arrowButton} aria-label="Scroll left">
                        <MdArrowBack size={20} />
                    </button>
                    <button onClick={() => scroll('right')} className={styles.arrowButton} aria-label="Scroll right">
                        <MdArrowForward size={20} />
                    </button>
                </div>
            </div>

            <div ref={scrollRef} className={styles.scrollRow}>
                {recommendedProducts.map((product) => (
                    <RecommendationCard key={product.id} product={product} />
                ))}
            </div>
        </section>
    );
}

export default RecommendationsSlider;