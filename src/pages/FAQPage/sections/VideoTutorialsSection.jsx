import { useRef } from 'react';
import { MdArrowBack, MdArrowForward } from 'react-icons/md';
import VideoTutorialCard from '../../../components/VideoTutorialCard/VideoTutorialCard';
import { videoTutorials } from '../../../services/faqPageData';
import styles from './VideoTutorialsSection.module.css';

function VideoTutorialsSection() {
    const scrollRef = useRef(null);

    const scroll = (direction) => {
        scrollRef.current?.scrollBy({ left: direction === 'left' ? -320 : 320, behavior: 'smooth' });
    };

    return (
        <section className={styles.section}>
            <div className={styles.header}>
                <div>
                    <span className={styles.eyebrow}>Visual Guides</span>
                    <h2 className={styles.heading}>Video Tutorials</h2>
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
                {videoTutorials.map((video) => (
                    <VideoTutorialCard key={video.id} {...video} />
                ))}
            </div>
        </section>
    );
}

export default VideoTutorialsSection;