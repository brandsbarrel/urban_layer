import CategoryProductCard from '../../../components/CategoryProductCard/CategoryProductCard';
import { completeYourCollectionProducts } from '../../../services/orderDetailData';
import styles from './CompleteCollectionSection.module.css';

function CompleteCollectionSection() {
    return (
        <section className={styles.section}>
            <h2 className={styles.heading}>Complete Your Collection</h2>
            <div className={styles.scrollRow}>
                {completeYourCollectionProducts.map((product) => (
                    <CategoryProductCard key={product.id} product={product} />
                ))}
            </div>
        </section>
    );
}

export default CompleteCollectionSection;