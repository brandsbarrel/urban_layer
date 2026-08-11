import { Link } from 'react-router-dom';
import { MdPlayArrow } from 'react-icons/md';
import { journalHeroImage } from '../../../services/journalPageData';
import styles from './JournalHeroSection.module.css';

function JournalHeroSection() {
    const scrollToVideo = (e) => {
        e.preventDefault();
        document.getElementById('cinematic-insights')?.scrollIntoView({ behavior: 'smooth' });
    };

    return (
        <header className={styles.hero} style={{ backgroundImage: `url('${journalHeroImage}')` }}>
            <div className={styles.gradient} />
            <div className={styles.content}>
                <span className={styles.eyebrow}>Autumn / Winter Edition</span>
                <h1 className={styles.heading}>The Architecture of Protection</h1>
                <p className={styles.subtitle}>
                    Exploring the intersection of avant-garde design, material science, and the modern
                    urban landscape. Edition 04 now live.
                </p>
                <div className={styles.actions}>
                    <Link to="#featured-article" className={styles.primaryButton}>
                        Explore Issue
                    </Link>
                    <button type="button" onClick={scrollToVideo} className={styles.secondaryButton}>
                        <span>Watch Film</span>
                        <MdPlayArrow size={16} />
                    </button>
                </div>
            </div>
        </header>
    );
}

export default JournalHeroSection;