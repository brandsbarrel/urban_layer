import { useDispatch } from 'react-redux';
import { MdAdd } from 'react-icons/md';
import { addToCart } from '../../redux/slices/cartSlice';
import styles from './CategoryProductCard.module.css';

function CategoryProductCard({ product }) {
    const dispatch = useDispatch();

    const handleAdd = () => {
        dispatch(addToCart({ id: product.id, name: product.name, price: product.price, image: product.image }));
    };

    return (
        <div className={styles.card}>
            <div className={styles.imageWrapper}>
                {product.badge && <span className={styles.badge}>{product.badge}</span>}
                <img src={product.image} alt={product.name} className={styles.image} />
            </div>
            {product.category && <span className={styles.category}>{product.category}</span>}
            <h4 className={styles.name}>{product.name}</h4>
            <div className={styles.footer}>
                <p className={styles.price}>₹{product.price.toLocaleString('en-IN')}</p>
                <button type="button" onClick={handleAdd} className={styles.addButton} aria-label={`Add ${product.name}`}>
                    <MdAdd size={20} />
                </button>
            </div>
        </div>
    );
}

export default CategoryProductCard;