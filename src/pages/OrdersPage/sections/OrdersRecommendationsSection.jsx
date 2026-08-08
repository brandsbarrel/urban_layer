import { useRef } from 'react';
import { MdChevronLeft, MdChevronRight } from 'react-icons/md';
import ProductCard from '../../../components/ProductCard/ProductCard';
import { orderPageRecommendations } from '../../../services/ordersPageData';
import styles from './OrdersRecommendationsSection.module.css';

function OrdersRecommendationsSection() {
    const scrollRef = useRef(null);

    const scroll = (direction) => {
        scrollRef.current?.scrollBy({ left: direction === 'left' ? -300 : 300, behavior: 'smooth' });
    };

    return (
        <section className={styles.section}>
            <div className={styles.header}>
                <div>
                    <p className={styles.eyebrow}>Curated For You</p>
                    <h2 className={styles.heading}>Inspired By Your Purchases</h2>
                </div>
                <div className={styles.arrows}>
                    <button onClick={() => scroll('left')} className={styles.arrowButton} aria-label="Scroll left">
                        <MdChevronLeft size={22} />
                    </button>
                    <button onClick={() => scroll('right')} className={styles.arrowButton} aria-label="Scroll right">
                        <MdChevronRight size={22} />
                    </button>
                </div>
            </div>
            <div ref={scrollRef} className={styles.grid}>
                {orderPageRecommendations.map((product) => (
                    <ProductCard key={product.id} product={product} variant="cornerAdd" />
                ))}
            </div>
        </section>
    );
}

export default OrdersRecommendationsSection;