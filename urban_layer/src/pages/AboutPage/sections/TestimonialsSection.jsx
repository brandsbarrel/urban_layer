import { useRef, useState } from 'react';
import TestimonialCard from '../../../components/TestimonialCard/TestimonialCard';
import { testimonials } from '../../../services/aboutPageData';
import styles from './TestimonialsSection.module.css';

function TestimonialsSection() {
    const scrollRef = useRef(null);
    const isDown = useRef(false);
    const startX = useRef(0);
    const scrollLeft = useRef(0);
    const [dragging, setDragging] = useState(false);

    const handleMouseDown = (e) => {
        isDown.current = true;
        setDragging(true);
        startX.current = e.pageX - scrollRef.current.offsetLeft;
        scrollLeft.current = scrollRef.current.scrollLeft;
    };

    const stopDragging = () => {
        isDown.current = false;
        setDragging(false);
    };

    const handleMouseMove = (e) => {
        if (!isDown.current) return;
        e.preventDefault();
        const x = e.pageX - scrollRef.current.offsetLeft;
        const walk = (x - startX.current) * 2;
        scrollRef.current.scrollLeft = scrollLeft.current - walk;
    };

    return (
        <section className={styles.section}>
            <h2 className={styles.heading}>Voices of Urban Layers</h2>
            <div
                ref={scrollRef}
                className={`${styles.scrollRow} ${dragging ? styles.dragging : ''}`}
                onMouseDown={handleMouseDown}
                onMouseLeave={stopDragging}
                onMouseUp={stopDragging}
                onMouseMove={handleMouseMove}
            >
                {testimonials.map((testimonial) => (
                    <TestimonialCard key={testimonial.name} {...testimonial} />
                ))}
            </div>
        </section>
    );
}

export default TestimonialsSection;