import { useDispatch } from 'react-redux';
import { addToCart } from '../../redux/slices/cartSlice';
import styles from './RecommendationCard.module.css';

function RecommendationCard({ product }) {
    const dispatch = useDispatch();

    const handleAddToCart = () => {
        dispatch(addToCart({ id: product.id, name: product.name, price: product.price, image: product.image }));
    };

    return (
        <button type="button" className={styles.card} onClick={handleAddToCart}>
            <div className={styles.imageWrapper}>
                <img src={product.image} alt={product.name} className={styles.image} />
            </div>
            <h4 className={styles.name}>{product.name}</h4>
            <p className={styles.price}>₹{product.price.toLocaleString('en-IN')}</p>
        </button>
    );
}

export default RecommendationCard;