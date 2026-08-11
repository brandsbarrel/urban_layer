import SearchFilterInput from '../../../components/SearchFilterInput/SearchFilterInput';
import PillFilterGroup from '../../../components/PillFilterGroup/PillFilterGroup';
import { MdSearch } from 'react-icons/md';
import { articleCategories } from '../../../services/journalPageData';
import styles from './CategoryFilterSection.module.css';

function CategoryFilterSection({ search, onSearchChange, activeCategory, onSelectCategory }) {
    return (
        <section className={styles.section}>
            <div className={styles.searchWrapper}>
                <SearchFilterInput
                    value={search}
                    onChange={onSearchChange}
                    placeholder="Search the archives..."
                    icon={MdSearch}
                    iconPosition="left"
                />
            </div>
            <div className={styles.pillsWrapper}>
                <PillFilterGroup
                    options={articleCategories}
                    selectedId={activeCategory}
                    onSelect={onSelectCategory}
                />
            </div>
        </section>
    );
}

export default CategoryFilterSection;