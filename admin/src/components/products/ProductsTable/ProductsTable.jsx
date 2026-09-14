import React from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { MdVisibility, MdEdit, MdArchive, MdStar, MdStarBorder } from "react-icons/md";
import {
  toggleSelect,
  toggleSelectAll,
  openDrawer,
  archiveProduct,
  toggleBestSeller,
} from "../../../redux/slices/productsSlice";
import styles from "./ProductsTable.module.css";

const STATUS_CLASS = {
  Active: "statusActive",
  "Low Stock": "statusLowStock",
  "Out of Stock": "statusOutOfStock",
  Draft: "statusDraft",
  Archived: "statusArchived",
};

const ProductsTable = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const items = useSelector((state) => state.products.items);
  const selectedIds = useSelector((state) => state.products.selectedIds);
  const searchQuery = useSelector((state) => state.products.searchQuery);
  const bestSellerOnly = useSelector((state) => state.products.bestSellerOnly);

  const query = searchQuery.trim().toLowerCase();
  let filtered = query
    ? items.filter(
        (p) =>
          p.name.toLowerCase().includes(query) ||
          p.sku.toLowerCase().includes(query) ||
          p.category.toLowerCase().includes(query)
      )
    : items;

  if (bestSellerOnly) {
    filtered = filtered.filter((p) => p.bestSeller || (p.tags || []).includes("best-seller"));
  }

  const allIds = filtered.map((p) => p.id);
  const allSelected =
    allIds.length > 0 && allIds.every((id) => selectedIds.includes(id));

  return (
    <div className={styles.tableWrapper}>
      <table className={styles.table}>
        <thead>
          <tr className={styles.headRow}>
            <th className={styles.checkboxCell}>
              <input
                type="checkbox"
                checked={allSelected}
                onChange={() => dispatch(toggleSelectAll(allIds))}
              />
            </th>
            <th className={styles.headCell}>PREVIEW</th>
            <th className={styles.headCell}>PRODUCT NAME &amp; SKU</th>
            <th className={styles.headCell}>CASE STYLE</th>
            <th className={`${styles.headCell} ${styles.alignRight}`}>
              PRICE
            </th>
            <th className={`${styles.headCell} ${styles.alignCenter}`}>
              STOCK
            </th>
            <th className={styles.headCell}>STATUS</th>
            <th className={`${styles.headCell} ${styles.alignRight}`}>
              ACTIONS
            </th>
          </tr>
        </thead>
        <tbody>
          {filtered.map((product) => {
            const isBestSeller = Boolean(product.bestSeller || (product.tags || []).includes("best-seller"));

            return (
              <tr
                key={product.id}
                className={styles.row}
                onClick={() => dispatch(openDrawer(product.id))}
              >
                <td
                  className={styles.checkboxCell}
                  onClick={(e) => e.stopPropagation()}
                >
                  <input
                    type="checkbox"
                    checked={selectedIds.includes(product.id)}
                    onChange={() => dispatch(toggleSelect(product.id))}
                  />
                </td>
                <td className={styles.cell}>
                  <div className={styles.thumb}>
                    <img src={product.image} alt={product.name} />
                  </div>
                </td>
                <td className={styles.cell}>
                  <div className={styles.nameCol}>
                    <span className={styles.productName}>{product.name}</span>
                    <span className={styles.sku}>{product.sku}</span>
                    {isBestSeller && (
                      <span
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          gap: "3px",
                          fontSize: "11px",
                          fontWeight: "600",
                          color: "#854d0e",
                          background: "#fef9c3",
                          padding: "1px 6px",
                          borderRadius: "10px",
                          width: "fit-content",
                          marginTop: "2px"
                        }}
                      >
                        <MdStar style={{ color: "#ca8a04", fontSize: "12px" }} /> Best Seller
                      </span>
                    )}
                  </div>
                </td>
                <td className={styles.cell}>
                  <span className={styles.categoryBadge}>
                    {product.category}
                  </span>
                </td>
                <td className={`${styles.cell} ${styles.alignRight}`}>
                  <span className={styles.price}>
                    ${product.price.toFixed(2)}
                  </span>
                </td>
                <td className={`${styles.cell} ${styles.alignCenter}`}>
                  <div className={styles.stockCol}>
                    <span>{product.stock}</span>
                    <div
                      className={`${styles.stockDot} ${styles[STATUS_CLASS[product.status]]}`}
                    />
                  </div>
                </td>
                <td className={styles.cell}>
                  <span
                    className={`${styles.statusBadge} ${styles[STATUS_CLASS[product.status]]}`}
                  >
                    {product.status}
                  </span>
                </td>
                <td className={`${styles.cell} ${styles.alignRight}`}>
                  <div
                    className={styles.rowActions}
                    onClick={(e) => e.stopPropagation()}
                  >
                    <button
                      className={styles.iconButton}
                      title={isBestSeller ? "Remove from Best Sellers" : "Mark as Best Seller"}
                      onClick={() => dispatch(toggleBestSeller(product))}
                    >
                      {isBestSeller ? (
                        <MdStar style={{ color: "#ca8a04", fontSize: "18px" }} />
                      ) : (
                        <MdStarBorder style={{ fontSize: "18px" }} />
                      )}
                    </button>
                    <button
                      className={styles.iconButton}
                      title="View"
                      onClick={() => dispatch(openDrawer(product.id))}
                    >
                      <MdVisibility />
                    </button>
                    <button
                      className={styles.iconButton}
                      title="Edit"
                      onClick={() => navigate(`/products/edit/${product.id}`)}
                    >
                      <MdEdit />
                    </button>
                    <button
                      className={styles.iconButton}
                      title="Archive"
                      onClick={() => dispatch(archiveProduct(product.id))}
                    >
                      <MdArchive />
                    </button>
                  </div>
                </td>
              </tr>
            );
          })}
          {filtered.length === 0 && (
            <tr>
              <td colSpan={8} className={styles.emptyCell}>
                {bestSellerOnly
                  ? "No Best Seller products found. Click the star icon on any product to mark it as a Best Seller."
                  : "No products match your search."}
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default ProductsTable;
