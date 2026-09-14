import React from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { MdClose, MdMoreVert, MdStar, MdStarBorder } from "react-icons/md";
import { closeDrawer, toggleBestSeller } from "../../../redux/slices/productsSlice";
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
  const isBestSeller = Boolean(product && (product.bestSeller || (product.tags || []).includes("best-seller")));

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
                      {product.phoneModel?.name || product.phoneModelName || product.collectionLabel}
                    </span>
                    <h4 className={styles.productName}>{product.name}</h4>
                    {isBestSeller && (
                      <span
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          gap: "4px",
                          fontSize: "12px",
                          fontWeight: "600",
                          color: "#854d0e",
                          background: "#fef9c3",
                          padding: "2px 8px",
                          borderRadius: "12px",
                          marginTop: "4px"
                        }}
                      >
                        <MdStar style={{ color: "#ca8a04" }} /> Best Seller
                      </span>
                    )}
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
                  {(product.variants || []).map((variant, index) => (
                    <div
                      key={variant.id || index}
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
                  {(product.activity || []).map((entry, index) => (
                    <div key={entry.id || index} className={styles.timelineItem}>
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
                style={{
                  background: isBestSeller ? "#fef9c3" : "#ffffff",
                  color: isBestSeller ? "#854d0e" : "#333",
                  border: "1px solid #ca8a04",
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "6px"
                }}
                onClick={() => dispatch(toggleBestSeller(product))}
              >
                {isBestSeller ? (
                  <>
                    <MdStar style={{ color: "#ca8a04" }} /> Unmark Best Seller
                  </>
                ) : (
                  <>
                    <MdStarBorder /> Mark Best Seller
                  </>
                )}
              </button>
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
