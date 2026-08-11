import { useDispatch } from 'react-redux';
import { addToCart } from '../../redux/slices/cartSlice';
import styles from './AccessoryHighlightItem.module.css';

function AccessoryHighlightItem({ id, icon: Icon, name, subtitle, price, image }) {
    const dispatch = useDispatch();

    const handleAdd = () => {
        dispatch(addToCart({ id, name, price, image, subtitle }));
    };

    return (
        <button type="button" onClick={handleAdd} className={styles.item}>
            <div className={styles.iconBox}>
                <Icon size={28} />
            </div>
            <div className={styles.info}>
                <h4 className={styles.name}>{name}</h4>
                <p className={styles.subtitle}>{subtitle}</p>
            </div>
            <span className={styles.price}>₹{price.toLocaleString('en-IN')}</span>
        </button>
    );
}

export default AccessoryHighlightItem;