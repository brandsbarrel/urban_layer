import { useRef } from 'react';
import { MdChevronLeft, MdChevronRight } from 'react-icons/md';
import ProductCard from '../../../components/ProductCard/ProductCard';
import { recommendedForYouProducts } from '../../../services/accountPageData';
import styles from './RecommendedSection.module.css';

function RecommendedSection() {
    const scrollRef = useRef(null);

    const scroll = (direction) => {
        scrollRef.current?.scrollBy({ left: direction === 'left' ? -300 : 300, behavior: 'smooth' });
    };

    return (
        <section>
            <div className={styles.header}>
                <h2 className={styles.heading}>Recommended For You</h2>
                <div className={styles.arrows}>
                    <button onClick={() => scroll('left')} className={styles.arrowButton} aria-label="Scroll left">
                        <MdChevronLeft size={22} />
                    </button>
                    <button onClick={() => scroll('right')} className={styles.arrowButton} aria-label="Scroll right">
                        <MdChevronRight size={22} />
                    </button>
                </div>
            </div>
            <div ref={scrollRef} className={styles.scrollRow}>
                {recommendedForYouProducts.map((product) => (
                    <ProductCard key={product.id} product={product} variant="cornerAdd" />
                ))}
            </div>
        </section>
    );
}

export default RecommendedSection;