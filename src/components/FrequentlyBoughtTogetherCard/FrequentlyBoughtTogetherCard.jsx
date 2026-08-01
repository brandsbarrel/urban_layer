import { useDispatch } from 'react-redux';
import { addToCart } from '../../redux/slices/cartSlice';
import styles from './FrequentlyBoughtTogetherCard.module.css';

function FrequentlyBoughtTogetherCard({ id, images, title, description, price, originalPrice }) {
    const dispatch = useDispatch();

    const handleAddBundle = () => {
        dispatch(addToCart({ id, name: title, price, image: images[0] }));
    };

    return (
        <div className={styles.card}>
            <div className={styles.imageStack}>
                {images.map((img, index) => (
                    <div key={index} className={styles.imageTile}>
                        <img src={img} alt="" className={styles.image} />
                    </div>
                ))}
            </div>
            <div className={styles.textBlock}>
                <h4 className={styles.title}>{title}</h4>
                <p className={styles.description}>{description}</p>
            </div>
            <div className={styles.priceBlock}>
                <span className={styles.price}>
                    ₹{price.toLocaleString('en-IN')}
                    {originalPrice && (
                        <span className={styles.originalPrice}>₹{originalPrice.toLocaleString('en-IN')}</span>
                    )}
                </span>
                <button type="button" onClick={handleAddBundle} className={styles.ctaButton}>
                    Add Bundle
                </button>
            </div>
        </div>
    );
}

export default FrequentlyBoughtTogetherCard;