import { useState } from 'react';
import styles from './Newsletter.module.css';

function Newsletter() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('idle');

  const handleSubmit = (event) => {
    event.preventDefault();
    const trimmedEmail = email.trim();

    if (!trimmedEmail || !event.currentTarget.checkValidity()) {
      setStatus('error');
      return;
    }

    setStatus('success');
  };

  return (
    <section className={styles.section}>
      <div className={styles.inner}>
        <div>
          <p className={styles.eyebrow}>Early access</p>
          <h2>Stay in the Layers.</h2>
          <p>
            Subscribe & get 10% off your first order, plus early access to new collections and
            limited drops.
          </p>
        </div>
        <form className={styles.form} onSubmit={handleSubmit} noValidate>
          <label htmlFor="home-newsletter-email">Email address</label>
          <div className={styles.formRow}>
            <input
              id="home-newsletter-email"
              type="email"
              value={email}
              onChange={(event) => {
                setEmail(event.target.value);
                setStatus('idle');
              }}
              placeholder="Enter your email address"
              autoComplete="email"
              required
            />
            <button type="submit">Subscribe</button>
          </div>
          {status === 'error' && (
            <p className={styles.error} role="alert">
              Enter a valid email address to preview the subscription flow.
            </p>
          )}
          {status === 'success' && (
            <p className={styles.success} role="status">
              You are on the preview list. Backend subscription can connect here later.
            </p>
          )}
        </form>
      </div>
    </section>
  );
}

export default Newsletter;
