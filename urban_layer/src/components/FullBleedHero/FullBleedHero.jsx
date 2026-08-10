import { Link } from 'react-router-dom';
import styles from './FullBleedHero.module.css';

function ActionButton({ action, className }) {
    if (!action) return null;
    return action.to ? (
        <Link to={action.to} className={className}>
            {action.label}
        </Link>
    ) : (
        <button type="button" onClick={action.onClick} className={className}>
            {action.label}
        </button>
    );
}

function FullBleedHero({
    image,
    imageAlt,
    align = 'center',
    overlay = 'flat',
    eyebrow,
    heading,
    subtitle,
    primaryAction,
    secondaryAction,
}) {
    return (
        <section className={styles.hero}>
            <img src={image} alt={imageAlt} className={styles.bgImage} />
            <div className={overlay === 'gradient' ? styles.overlayGradient : styles.overlayFlat} />
            <div className={align === 'left' ? styles.contentLeft : styles.contentCenter}>
                {eyebrow && <span className={styles.eyebrow}>{eyebrow}</span>}
                <h1 className={styles.heading}>{heading}</h1>
                {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
                {(primaryAction || secondaryAction) && (
                    <div className={styles.actions}>
                        <ActionButton action={primaryAction} className={styles.primaryButton} />
                        <ActionButton action={secondaryAction} className={styles.secondaryButton} />
                    </div>
                )}
            </div>
        </section>
    );
}

export default FullBleedHero;