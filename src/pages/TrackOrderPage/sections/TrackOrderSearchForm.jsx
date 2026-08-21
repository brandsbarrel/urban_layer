import { useState } from 'react';
import styles from './TrackOrderSearchForm.module.css';

function TrackOrderSearchForm({ initialOrderNumber = '', onSearch, isSearching }) {
    const [orderNumber, setOrderNumber] = useState(initialOrderNumber);
    const [contact, setContact] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        onSearch(orderNumber);
    };

    return (
        <section className={styles.section}>
            <form className={styles.card} onSubmit={handleSubmit}>
                <div className={styles.grid}>
                    <div className={styles.field}>
                        <label className={styles.label}>Order Number</label>
                        <input
                            type="text"
                            value={orderNumber}
                            onChange={(e) => setOrderNumber(e.target.value)}
                            placeholder="e.g., UL-84291"
                            className={styles.input}
                        />
                    </div>
                    <div className={styles.field}>
                        <label className={styles.label}>Email or Phone</label>
                        <input
                            type="text"
                            value={contact}
                            onChange={(e) => setContact(e.target.value)}
                            placeholder="alexander@sterling.com"
                            className={styles.input}
                        />
                    </div>
                </div>
                <button type="submit" className={styles.submitButton} disabled={isSearching}>
                    {isSearching ? 'Searching...' : 'Search Order Status'}
                </button>
            </form>
        </section>
    );
}

export default TrackOrderSearchForm;