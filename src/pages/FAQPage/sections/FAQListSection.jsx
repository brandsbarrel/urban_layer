import { Link } from 'react-router-dom';
import FAQAccordion from '../../../components/FAQAccordion/FAQAccordion';
import styles from './FAQListSection.module.css';

function FAQListSection({ items }) {
    return (
        <section id="faq-list" className={styles.section}>
            <div className={styles.container}>
                <div className={styles.header}>
                    <span className={styles.headerLine} />
                    <h2 className={styles.heading}>Frequently Asked Questions</h2>
                </div>

                {items.length === 0 ? (
                    <div className={styles.emptyState}>
                        <p className={styles.emptyText}>
                            No questions in this category yet. Our concierge team can help directly.
                        </p>
                        <Link to="/contact" className={styles.emptyLink}>
                            Contact Us
                        </Link>
                    </div>
                ) : (
                    <FAQAccordion
                        key={items.map((i) => i.id).join(',')}
                        items={items}
                        mode="single"
                        showFeedback
                        defaultOpenId={items[0]?.id}
                    />
                )}
            </div>
        </section>
    );
}

export default FAQListSection;