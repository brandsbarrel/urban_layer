import { useEffect, useRef } from 'react';
import styles from './AuthBrandPanel.module.css';

function AuthBrandPanel({
  image,
  imageAlt = 'Urban Layers Co. lifestyle photography',
  heading,
  subtitle,
  features = [],
  badges = [],
  featureVariant = 'label',
  footerText,
  enableParallax = true,
  heightOffset = 0,
  mobileVisible = false,
  gradientVariant = 'bottom-heavy',
  headingVariant = 'display',
}) {
  const imgRef = useRef(null);

  useEffect(() => {
    if (!enableParallax) return undefined;
    const handleMouseMove = (e) => {
      const amount = 20;
      const x = (e.clientX / window.innerWidth - 0.5) * amount;
      const y = (e.clientY / window.innerHeight - 0.5) * amount;
      if (imgRef.current) {
        imgRef.current.style.transform = `scale(1.1) translate(${x}px, ${y}px)`;
      }
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [enableParallax]);

  const panelStyle = heightOffset ? { height: `calc(100vh - ${heightOffset}px)` } : undefined;

  return (
    <section className={mobileVisible ? styles.panelVisible : styles.panel} style={panelStyle}>
      <div className={styles.imageWrapper}>
        <div
          className={gradientVariant === 'top-bottom' ? styles.gradientTopBottom : styles.gradient}
        />
        <img
          ref={imgRef}
          src={image}
          alt={imageAlt}
          className={enableParallax ? styles.image : `${styles.image} ${styles.imageHoverScale}`}
        />
      </div>

      <div className={styles.content}>
        {heading && (
          <h1 className={headingVariant === 'headline' ? styles.headingHeadline : styles.heading}>
            {heading}
          </h1>
        )}
        {subtitle && <p className={styles.subtitle}>{subtitle}</p>}

        {features.length > 0 && (
          <ul className={styles.featureList}>
            {features.map((feature) => (
              <li key={feature.label} className={styles.featureItem}>
                <div className={styles.featureIcon}>
                  <feature.icon size={20} />
                </div>
                <span
                  className={
                    featureVariant === 'title' ? styles.featureLabelTitle : styles.featureLabel
                  }
                >
                  {feature.label}
                </span>
              </li>
            ))}
          </ul>
        )}

        {badges.length > 0 && (
          <div className={styles.badgeRow}>
            {badges.map((badge) => (
              <div key={badge.label} className={styles.badge}>
                <badge.icon size={18} className={styles.badgeIcon} />
                <span className={styles.badgeLabel}>{badge.label}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {footerText && (
        <div className={styles.footerBranding}>
          <p className={styles.footerText}>{footerText}</p>
        </div>
      )}
    </section>
  );
}

export default AuthBrandPanel;