import { useMemo, useState } from 'react';
import JournalHeroSection from './sections/JournalHeroSection';
import FeaturedArticleSection from './sections/FeaturedArticleSection';
import CategoryFilterSection from './sections/CategoryFilterSection';
import ArticlesGridSection from './sections/ArticlesGridSection';
import EditorsSelectionSection from './sections/EditorsSelectionSection';
import BuyingGuidesSection from './sections/BuyingGuidesSection';
import CinematicInsightsSection from './sections/CinematicInsightsSection';
import NewsletterInstagramSection from './sections/NewsletterInstagramSection';
import { articles } from '../../services/journalPageData';
import styles from './JournalPage.module.css';

function JournalPage() {
    const [search, setSearch] = useState('');
    const [activeCategory, setActiveCategory] = useState('all');

    const filteredArticles = useMemo(() => {
        return articles.filter((article) => {
            const matchesCategory = activeCategory === 'all' || article.category === activeCategory;
            const query = search.toLowerCase();
            const matchesSearch =
                !query ||
                article.title.toLowerCase().includes(query) ||
                article.excerpt.toLowerCase().includes(query);
            return matchesCategory && matchesSearch;
        });
    }, [search, activeCategory]);

    return (
        <div className={styles.page}>
            <JournalHeroSection />
            <FeaturedArticleSection />
            <CategoryFilterSection
                search={search}
                onSearchChange={setSearch}
                activeCategory={activeCategory}
                onSelectCategory={setActiveCategory}
            />
            <ArticlesGridSection items={filteredArticles} />
            <EditorsSelectionSection />
            <BuyingGuidesSection />
            <CinematicInsightsSection />
            <NewsletterInstagramSection />
        </div>
    );
}

export default JournalPage;