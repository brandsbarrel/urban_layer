import React from "react";
import styles from "./ItemsSummary.module.css";

const ItemsSummary = ({ products }) => {
  return (
    <div>
      <h4 className={styles.title}>Items Summary</h4>
      <div className={styles.list}>
        {products.map((product) => (
          <div key={product.id} className={styles.item}>
            <div className={styles.thumb}>
              <img src={product.image} alt={product.name} />
            </div>
            <div className={styles.info}>
              <p className={styles.name}>{product.name}</p>
              <p className={styles.meta}>
                SKU: {product.sku} | {product.variant}
              </p>
            </div>
            <div className={styles.priceCol}>
              <p className={styles.price}>${product.price.toFixed(2)}</p>
              <p className={styles.qty}>Qty: {product.qty}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ItemsSummary;