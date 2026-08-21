import OrderProductCard from '../../../components/OrderProductCard/OrderProductCard';
import styles from './ProductsListSection.module.css';

function ProductsListSection({ items }) {
    return (
        <div className={styles.list}>
            {items.map((item) => (
                <OrderProductCard key={item.id} item={item} />
            ))}
        </div>
    );
}

export default ProductsListSection;