import { useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { MdShoppingBag, MdStar } from 'react-icons/md';
import { addToCartAsync } from '../../../redux/slices/cartSlice';
import styles from './BestSellers.module.css';

function BestSellers({ products = [] }) {
  const dispatch = useDispatch();

  const addToCart = (product) => {
    dispatch(
      addToCartAsync({
        productId: product.id,
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.image,
        subtitle: product.device,
        quantity: 1,
      })
    );
  };

  return (
    <section className={styles.section}>
      <div className={styles.header}>
        <p className={styles.eyebrow}>Best sellers</p>
        <h2>Most Wanted</h2>
        <p>Refined protection trusted by customers who care about every detail.</p>
      </div>
      <div className={styles.grid}>
        {products.map((product) => (
          <article className={styles.card} key={product.id}>
            {product.badge && <p className={styles.badge}>{product.badge}</p>}
            <Link to={`/product/${product.slug}`} className={styles.imageWrap}>
              <img src={product.image} alt={`${product.name} phone case`} loading="lazy" />
            </Link>
            <div className={styles.info}>
              <div>
                <h3>
                  <Link to={`/product/${product.slug}`}>{product.name}</Link>
                </h3>
                <p className={styles.device}>{product.device}</p>
              </div>
              <p className={styles.price}>Rs.{product.price.toLocaleString('en-IN')}</p>
              <p className={styles.rating} aria-label={`${product.rating} stars from ${product.reviewCount} reviews`}>
                <span aria-hidden="true" className={styles.stars}>
                  {Array.from({ length: 5 }).map((_, index) => (
                    <MdStar key={index} />
                  ))}
                </span>
                {product.rating.toFixed(1)} ({product.reviewCount})
              </p>
              <button type="button" className={styles.addButton} onClick={() => addToCart(product)}>
                <MdShoppingBag aria-hidden="true" />
                Add to Cart
              </button>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

export default BestSellers;
