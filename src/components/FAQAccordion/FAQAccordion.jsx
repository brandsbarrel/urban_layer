import { useState } from 'react';
import { MdExpandMore, MdThumbUpOffAlt, MdThumbDownOffAlt, MdThumbUp, MdThumbDown } from 'react-icons/md';
import styles from './FAQAccordion.module.css';

function FAQAccordion({ items, mode = 'multi', showFeedback = false, defaultOpenId }) {
    const [openIds, setOpenIds] = useState(defaultOpenId ? [defaultOpenId] : []);
    const [feedback, setFeedback] = useState({});

    const toggle = (id) => {
        if (mode === 'single') {
            setOpenIds((prev) => (prev.includes(id) ? [] : [id]));
        } else {
            setOpenIds((prev) => (prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]));
        }
    };

    const handleFeedback = (id, vote) => {
        setFeedback((prev) => ({ ...prev, [id]: vote }));
    };

    return (
        <div className={styles.list}>
            {items.map((item) => {
                const isOpen = openIds.includes(item.id);
                const vote = feedback[item.id];
                return (
                    <div key={item.id} className={styles.item}>
                        <button type="button" onClick={() => toggle(item.id)} className={styles.question}>
                            <span>{item.question}</span>
                            <MdExpandMore
                                size={22}
                                className={isOpen ? `${styles.icon} ${styles.iconOpen}` : styles.icon}
                            />
                        </button>
                        <div
                            className={
                                isOpen ? `${styles.answerWrapper} ${styles.answerWrapperOpen}` : styles.answerWrapper
                            }
                        >
                            <p className={styles.answer}>{item.answer}</p>
                            {showFeedback && (
                                <div className={styles.feedbackRow}>
                                    <span className={styles.feedbackLabel}>Was this helpful?</span>
                                    <div className={styles.feedbackButtons}>
                                        <button
                                            type="button"
                                            onClick={() => handleFeedback(item.id, 'up')}
                                            className={styles.feedbackButton}
                                            aria-label="Yes, this was helpful"
                                        >
                                            {vote === 'up' ? <MdThumbUp size={20} className={styles.feedbackActive} /> : <MdThumbUpOffAlt size={20} />}
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => handleFeedback(item.id, 'down')}
                                            className={styles.feedbackButton}
                                            aria-label="No, this wasn't helpful"
                                        >
                                            {vote === 'down' ? <MdThumbDown size={20} className={styles.feedbackActive} /> : <MdThumbDownOffAlt size={20} />}
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                );
            })}
        </div>
    );
}

export default FAQAccordion;