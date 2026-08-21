import FeaturedArticleCard from '../../../components/FeaturedArticleCard/FeaturedArticleCard';
import { featuredArticle } from '../../../services/journalPageData';
import styles from './FeaturedArticleSection.module.css';

function FeaturedArticleSection() {
    return (
        <section id="featured-article" className={styles.section}>
            <FeaturedArticleCard {...featuredArticle} />
        </section>
    );
}

export default FeaturedArticleSection;