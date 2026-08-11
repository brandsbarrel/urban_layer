import { useRef } from 'react';
import { MdChevronLeft, MdChevronRight } from 'react-icons/md';
import CategoryProductCard from '../../../components/CategoryProductCard/CategoryProductCard';
import { whileYouWaitProducts } from '../../../services/trackOrderData';
import styles from './WhileYouWaitSection.module.css';

function WhileYouWaitSection() {
    const scrollRef = useRef(null);

    const scroll = (direction) => {
        scrollRef.current?.scrollBy({ left: direction === 'left' ? -300 : 300, behavior: 'smooth' });
    };

    return (
        <section className={styles.section}>
            <div className={styles.header}>
                <div>
                    <h2 className={styles.heading}>While You Wait</h2>
                    <p className={styles.subtitle}>Complement your order with these curated essentials.</p>
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
            <div ref={scrollRef} className={styles.scrollRow}>
                {whileYouWaitProducts.map((product) => (
                    <CategoryProductCard key={product.id} product={product} />
                ))}
            </div>
        </section>
    );
}

export default WhileYouWaitSection;