import React from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { MdVisibility, MdEdit, MdArchive } from "react-icons/md";
import {
  toggleSelect,
  toggleSelectAll,
  openDrawer,
  archiveProduct,
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

  const query = searchQuery.trim().toLowerCase();
  const filtered = query
    ? items.filter(
        (p) =>
          p.name.toLowerCase().includes(query) ||
          p.sku.toLowerCase().includes(query) ||
          p.category.toLowerCase().includes(query)
      )
    : items;

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
            <th className={styles.headCell}>CATEGORY</th>
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
          {filtered.map((product) => (
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
          ))}
          {filtered.length === 0 && (
            <tr>
              <td colSpan={8} className={styles.emptyCell}>
                No products match your search.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default ProductsTable;