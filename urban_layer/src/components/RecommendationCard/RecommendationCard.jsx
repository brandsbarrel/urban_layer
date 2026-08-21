import { useDispatch } from 'react-redux';
import { addToCartAsync } from '../../redux/slices/cartSlice';
import styles from './RecommendationCard.module.css';

function RecommendationCard({ product }) {
    const dispatch = useDispatch();
    const productImage = product.featuredImage || product.image || product.images?.[0] || '';
    const productPrice = Number(product.price || 0);

    const handleAddToCart = () => {
        dispatch(addToCartAsync({ productId: product.id, quantity: 1 }));
    };

    return (
        <button type="button" className={styles.card} onClick={handleAddToCart}>
            <div className={styles.imageWrapper}>
                <img src={productImage} alt={product.name} className={styles.image} />
            </div>
            <h4 className={styles.name}>{product.name}</h4>
            <p className={styles.price}>₹{productPrice.toLocaleString('en-IN')}</p>
        </button>
    );
}

export default RecommendationCard;
