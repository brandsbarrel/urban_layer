import { useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { addToCart } from '../../redux/slices/cartSlice';
import styles from './OrderProductCard.module.css';

function OrderProductCard({ item }) {
    const dispatch = useDispatch();

    const handleBuyAgain = () => {
        dispatch(addToCart({ id: item.id, name: item.name, price: item.price, image: item.image }));
    };

    return (
        <div className={styles.card}>
            <div className={styles.imageWrapper}>
                <img src={item.image} alt={item.name} className={styles.image} />
            </div>
            <div className={styles.info}>
                <div className={styles.topRow}>
                    <div>
                        <h3 className={styles.name}>{item.name}</h3>
                        <p className={styles.qty}>Quantity: {item.quantity}</p>
                    </div>
                    <span className={styles.price}>₹{item.price.toLocaleString('en-IN')}</span>
                </div>
                <div className={styles.actions}>
                    <Link to={`/product/${item.id}`} className={styles.viewButton}>
                        View Product
                    </Link>
                    <button type="button" onClick={handleBuyAgain} className={styles.buyAgainButton}>
                        Buy Again
                    </button>
                </div>
            </div>
        </div>
    );
}

export default OrderProductCard;