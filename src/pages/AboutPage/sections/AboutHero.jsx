import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { MdExpandMore } from 'react-icons/md';
import styles from './AboutHero.module.css';

const HERO_IMAGE =
    'https://lh3.googleusercontent.com/aida/AP1WRLt7thBJUn8X6xSBCAvjxy4IJvwBx0SM83TnjRqBHMRNdvP5jZZNsvX_g82m_ChXvNN_wo10myMuiOf52R5QqgKsOTI-v6KaWiwOkIt02zL31nAXUvBApi4WmleL4Ym-__KMzDEL0mPkSjCHOHT-5d4lWX_d7xd8Er_lKMBBBmrY1BhLG1DeK6HDJZ7zDaSJxEBSHcfXoe_JINtKBI05zLeemHVe9VjIFiDVDfHCGqiuidpWLBkQGqDe9zI';

function AboutHero() {
    const bgRef = useRef(null);

    useEffect(() => {
        const handleScroll = () => {
            if (bgRef.current) {
                bgRef.current.style.backgroundPositionY = `${window.pageYOffset * 0.5}px`;
            }
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const scrollToPhilosophy = (e) => {
        e.preventDefault();
        document.getElementById('mission-vision')?.scrollIntoView({ behavior: 'smooth' });
    };

    return (
        <header className={styles.hero}>
            <div
                ref={bgRef}
                className={styles.bgImage}
                style={{ backgroundImage: `url('${HERO_IMAGE}')` }}
            />
            <div className={styles.overlay} />

            <div className={styles.content}>
                <h1 className={styles.title}>
                    Designed for Protection.
                    <br />
                    Crafted for Style.
                </h1>
                <p className={styles.subtitle}>
                    Redefining the relationship between technology and luxury through meticulous
                    craftsmanship and avant-garde materials.
                </p>
                <div className={styles.actions}>
                    <Link to="/shop" className={styles.primaryButton}>
                        Explore Collection
                    </Link>
                    <button onClick={scrollToPhilosophy} className={styles.secondaryButton}>
                        Our Philosophy
                    </button>
                </div>
            </div>

            <div className={styles.scrollIndicator}>
                <MdExpandMore size={28} color="#ffffff" />
            </div>
        </header>
    );
}

export default AboutHero;