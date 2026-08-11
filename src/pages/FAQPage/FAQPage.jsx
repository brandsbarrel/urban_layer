import { useMemo, useState } from 'react';
import AssistanceBanner from '../../components/AssistanceBanner/AssistanceBanner';
import FAQHeroSection from './sections/FAQHeroSection';
import FAQCategoriesSection from './sections/FAQCategoriesSection';
import FAQListSection from './sections/FAQListSection';
import VideoTutorialsSection from './sections/VideoTutorialsSection';
import { faqItems } from '../../services/faqPageData';
import styles from './FAQPage.module.css';

function FAQPage() {
    const [searchTerm, setSearchTerm] = useState('');
    const [activeCategory, setActiveCategory] = useState(null);

    const filteredItems = useMemo(() => {
        return faqItems.filter((item) => {
            const matchesCategory = !activeCategory || item.category === activeCategory;
            const query = searchTerm.toLowerCase();
            const matchesSearch =
                !query ||
                item.question.toLowerCase().includes(query) ||
                item.answer.toLowerCase().includes(query);
            return matchesCategory && matchesSearch;
        });
    }, [activeCategory, searchTerm]);

    const scrollToList = () => {
        document.getElementById('faq-list')?.scrollIntoView({ behavior: 'smooth' });
    };

    const handleChipClick = (chip) => {
        const queryMap = {
            'Track My Delivery': 'track',
            'Warranty Status': 'warranty',
            'Return Policy': 'return',
        };
        setSearchTerm(queryMap[chip] || chip);
        setActiveCategory(null);
        scrollToList();
    };

    const handleSelectCategory = (categoryId) => {
        setActiveCategory((prev) => (prev === categoryId ? null : categoryId));
        setSearchTerm('');
        scrollToList();
    };

    return (
        <div className={styles.page}>
            <FAQHeroSection
                searchTerm={searchTerm}
                onSearchChange={setSearchTerm}
                onChipClick={handleChipClick}
            />
            <FAQCategoriesSection activeCategory={activeCategory} onSelectCategory={handleSelectCategory} />
            <FAQListSection items={filteredItems} />
            <VideoTutorialsSection />
            <div className={styles.assistanceWrapper}>
                <AssistanceBanner
                    heading="Still Need Help?"
                    subtitle="Our concierge team is available 24/7 to assist with your inquiries through your preferred channel."
                    whatsappLabel="WhatsApp Support"
                    emailLabel="Email Concierge"
                    callLabel="Request a Call"
                />
            </div>
        </div>
    );
}

export default FAQPage;