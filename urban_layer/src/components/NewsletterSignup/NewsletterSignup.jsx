import { useState } from 'react';
import { subscribeToNewsletter } from '../../services/newsletterService';
import styles from './NewsletterSignup.module.css';

function NewsletterSignup({ variant = 'full', bannerHeading, bannerText }) {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('idle');
  const isCompact = variant === 'compact';
  const isBanner = variant === 'banner';
  const isDark = variant === 'dark';

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) return;
    setStatus('loading');
    await subscribeToNewsletter(email);
    setStatus('success');
    setEmail('');
  };

  if (isBanner) {
    return (
      <div className={styles.bannerWrapper}>
        <div className={styles.bannerTextBlock}>
          <h2 className={styles.bannerHeading}>{bannerHeading}</h2>
          <p className={styles.bannerSubtext}>{bannerText}</p>
        </div>
        {status === 'success' ? (
          <p className={styles.bannerSuccess}>🎉 You're in! Check your inbox for confirmation.</p>
        ) : (
          <form className={styles.bannerForm} onSubmit={handleSubmit}>
            <input
              type="email"
              required
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={styles.bannerInput}
            />
            <button type="submit" className={styles.bannerButton} disabled={status === 'loading'}>
              {status === 'loading' ? 'SUBSCRIBING...' : 'SUBSCRIBE NOW'}
            </button>
          </form>
        )}
      </div>
    );
  }

  if (isDark) {
    return (
      <div className={styles.darkWrapper}>
        <h2 className={styles.darkTitle}>Join the Inner Circle</h2>
        <p className={styles.darkSubtitle}>
          Be the first to access limited collections and exclusive bespoke drops.
        </p>
        {status === 'success' ? (
          <p className={styles.darkSuccess}>🎉 You're in! Check your inbox for confirmation.</p>
        ) : (
          <form className={styles.darkForm} onSubmit={handleSubmit}>
            <input
              type="email"
              required
              placeholder="Email Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={styles.darkInput}
            />
            <button type="submit" className={styles.darkButton} disabled={status === 'loading'}>
              {status === 'loading' ? 'Subscribing...' : 'Subscribe'}
            </button>
          </form>
        )}
      </div>
    );
  }

  return (
    <div className={isCompact ? styles.compactWrapper : styles.wrapper}>
      {!isCompact && (
        <>
          <h2 className={styles.title}>Join the Inner Circle</h2>
          <p className={styles.subtitle}>
            Receive early access to limited edition drops, brand stories, and exclusive
            community events.
          </p>
        </>
      )}

      {status === 'success' ? (
        <p className={isCompact ? styles.compactSuccess : styles.successMessage}>
          🎉 You're in! Check your inbox for a confirmation email.
        </p>
      ) : (
        <form className={isCompact ? styles.compactForm : styles.form} onSubmit={handleSubmit}>
          <input
            type="email"
            required
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={isCompact ? styles.compactInput : styles.input}
          />
          <button
            type="submit"
            className={isCompact ? styles.compactButton : styles.button}
            disabled={status === 'loading'}
          >
            {status === 'loading' ? 'Subscribing...' : 'Subscribe'}
          </button>
        </form>
      )}

      {!isCompact && (
        <p className={styles.privacy}>By subscribing, you agree to our Privacy Policy.</p>
      )}
    </div>
  );
}

export default NewsletterSignup;