import React from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { MdClose, MdMoreVert } from "react-icons/md";
import { closeDrawer } from "../../../redux/slices/productsSlice";
import styles from "./ProductDrawer.module.css";

const ProductDrawer = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const drawerProductId = useSelector(
    (state) => state.products.drawerProductId
  );
  const product = useSelector((state) =>
    state.products.items.find((p) => p.id === drawerProductId)
  );

  const isOpen = Boolean(product);

  return (
    <>
      <div
        className={`${styles.backdrop} ${isOpen ? styles.backdropOpen : ""}`}
        onClick={() => dispatch(closeDrawer())}
      />
      <div className={`${styles.drawer} ${isOpen ? styles.drawerOpen : ""}`}>
        {product && (
          <>
            <div className={styles.header}>
              <h3 className={styles.title}>Product Details</h3>
              <button
                className={styles.closeButton}
                onClick={() => dispatch(closeDrawer())}
              >
                <MdClose />
              </button>
            </div>

            <div className={styles.body}>
              <div className={styles.mainImage}>
                <img src={product.image} alt={product.name} />
              </div>

              <div className={styles.infoSection}>
                <div className={styles.infoTop}>
                  <div>
                  <span className={styles.collectionLabel}>
                      {product.phoneModel || product.collectionLabel}
                  </span>
                    <h4 className={styles.productName}>{product.name}</h4>
                  </div>
                  <span className={styles.price}>
                    ${product.price.toFixed(2)}
                  </span>
                </div>
                <p className={styles.description}>{product.description}</p>
              </div>

              <div className={styles.statGrid}>
                <div className={styles.statCard}>
                  <p className={styles.statLabel}>AVAILABLE STOCK</p>
                  <p className={styles.statValue}>
                    {product.stock} <span>units</span>
                  </p>
                </div>
                <div className={styles.statCard}>
                  <p className={styles.statLabel}>UNFULFILLED ORDERS</p>
                  <p className={styles.statValue}>
                    {product.unfulfilledOrders} <span>units</span>
                  </p>
                </div>
              </div>

              <div className={styles.variantsSection}>
                <h5 className={styles.sectionLabel}>COLOR VARIANTS</h5>
                <div className={styles.swatches}>
                  {product.variants.map((variant, index) => (
                    <div
                      key={variant.id}
                      className={
                        index === 0
                          ? `${styles.swatch} ${styles.swatchActive}`
                          : styles.swatch
                      }
                    >
                      <div
                        className={styles.swatchInner}
                        style={{ backgroundColor: variant.color }}
                      />
                    </div>
                  ))}
                </div>
              </div>

              <div className={styles.activitySection}>
                <h5 className={styles.sectionLabel}>RECENT ACTIVITY</h5>
                <div className={styles.timeline}>
                  {product.activity.map((entry, index) => (
                    <div key={entry.id} className={styles.timelineItem}>
                      <div
                        className={
                          index === 0
                            ? `${styles.timelineDot} ${styles.timelineDotActive}`
                            : styles.timelineDot
                        }
                      />
                      <div>
                        <p className={styles.timelineMessage}>
                          {entry.message}
                        </p>
                        <p className={styles.timelineMeta}>{entry.meta}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className={styles.footer}>
              <button
                className={styles.editButton}
                onClick={() => navigate(`/products/edit/${product.id}`)}
              >
                Edit Product
              </button>
              <button className={styles.moreButton} title="Integration Required">
                <MdMoreVert />
              </button>
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default ProductDrawer;
