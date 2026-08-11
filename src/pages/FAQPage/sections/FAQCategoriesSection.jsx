import { MdShoppingCart, MdLocalShipping, MdAssignmentReturn, MdPayments, MdVerifiedUser, MdWatch } from 'react-icons/md';
import CategoryIconCard from '../../../components/CategoryIconCard/CategoryIconCard';
import { faqCategories } from '../../../services/faqPageData';
import styles from './FAQCategoriesSection.module.css';

const ICON_MAP = {
    shopping_cart: MdShoppingCart,
    local_shipping: MdLocalShipping,
    assignment_return: MdAssignmentReturn,
    payments: MdPayments,
    verified_user: MdVerifiedUser,
    watch: MdWatch,
};

function FAQCategoriesSection({ activeCategory, onSelectCategory }) {
    return (
        <section className={styles.section}>
            {faqCategories.map((category) => (
                <CategoryIconCard
                    key={category.id}
                    icon={ICON_MAP[category.icon]}
                    label={category.label}
                    isActive={activeCategory === category.id}
                    onClick={() => onSelectCategory(category.id)}
                />
            ))}
        </section>
    );
}

export default FAQCategoriesSection;