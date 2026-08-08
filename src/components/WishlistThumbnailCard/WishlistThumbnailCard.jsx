import { useNavigate } from 'react-router-dom';
import { MdVisibility, MdDelete } from 'react-icons/md';
import styles from './WishlistThumbnailCard.module.css';

function WishlistThumbnailCard({ item, onRemove }) {
    const navigate = useNavigate();

    return (
        <div className={styles.card}>
            <img src={item.image} alt={item.name} className={styles.image} />
            <div className={styles.overlay}>
                <button
                    type="button"
                    onClick={() => navigate('/wishlist')}
                    className={styles.iconButton}
                    aria-label={`View ${item.name}`}
                >
                    <MdVisibility size={22} />
                </button>
                <button
                    type="button"
                    onClick={() => onRemove(item.id)}
                    className={styles.iconButton}
                    aria-label={`Remove ${item.name}`}
                >
                    <MdDelete size={22} />
                </button>
            </div>
        </div>
    );
}

export default WishlistThumbnailCard;