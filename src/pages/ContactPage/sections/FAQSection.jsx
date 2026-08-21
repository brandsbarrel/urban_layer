import { Link } from 'react-router-dom';
import { MdArrowForward } from 'react-icons/md';
import FAQAccordion from '../../../components/FAQAccordion/FAQAccordion';
import { faqItems } from '../../../services/contactPageData';
import styles from './FAQSection.module.css';

function FAQSection() {
    return (
        <section className={styles.section}>
            <h2 className={styles.heading}>Frequently Asked</h2>
            <FAQAccordion items={faqItems} />
            <div className={styles.footer}>
                <Link to="/faq" className={styles.link}>
                    View all FAQs <MdArrowForward size={16} />
                </Link>
            </div>
        </section>
    );
}

export default FAQSection;