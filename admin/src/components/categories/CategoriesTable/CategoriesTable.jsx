import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { MdDragIndicator, MdMoreVert, MdVisibilityOff, MdVisibility, MdEdit, MdDelete, MdArrowUpward, MdArrowDownward } from "react-icons/md";
import {
  toggleSelect,
  toggleSelectAll,
  toggleRowMenu,
  hideCategory,
  deleteCategory,
  moveCategory,
  openDrawer,
} from "../../../redux/slices/categoriesSlice";
import ConfirmModal from "../../common/ConfirmModal/ConfirmModal";
import styles from "./CategoriesTable.module.css";

const CategoriesTable = () => {
  const dispatch = useDispatch();
  const { items, selectedIds, searchQuery, statusFilter, activeMenuId } =
    useSelector((state) => state.categories);
  const [deleteTarget, setDeleteTarget] = React.useState(null);

  const query = searchQuery.trim().toLowerCase();
  const filtered = items.filter((c) => {
    const matchesQuery =
      !query ||
      c.name.toLowerCase().includes(query) ||
      c.slug.toLowerCase().includes(query) ||
      c.id.toLowerCase().includes(query);
    const matchesStatus = statusFilter === "All" || c.status === statusFilter;
    return matchesQuery && matchesStatus;
  });

  const allIds = filtered.map((c) => c.id);
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
            <th className={styles.headCell}>Category</th>
            <th className={styles.headCell}>Slug</th>
            <th className={styles.headCell}>Phones</th>
            <th className={styles.headCell}>Products</th>
            <th className={styles.headCell}>SEO Score</th>
            <th className={styles.headCell}>Status</th>
            <th className={`${styles.headCell} ${styles.alignRight}`}>
              Actions
            </th>
          </tr>
        </thead>
        <tbody>
          {filtered.map((category) => (
            <tr
              key={category.id}
              className={
                category.status === "Hidden"
                  ? `${styles.row} ${styles.rowMuted}`
                  : styles.row
              }
            >
              <td className={styles.checkboxCell}>
                <div className={styles.checkboxGroup}>
                  <MdDragIndicator
                    className={styles.dragHandle}
                    title="Drag to reorder — Coming Soon"
                  />
                  <input
                    type="checkbox"
                    checked={selectedIds.includes(category.id)}
                    onChange={() => dispatch(toggleSelect(category.id))}
                  />
                </div>
              </td>
              <td className={styles.cell}>
                <div className={styles.categoryCol}>
                  <img
                    src={category.image}
                    alt={category.name}
                    className={styles.thumb}
                  />
                  <div>
                    <p className={styles.categoryName}>{category.name}</p>
                    <p className={styles.breadcrumb}>{category.breadcrumb}</p>
                  </div>
                </div>
              </td>
              <td className={styles.cell}>
                <span className={styles.slug}>{category.slug}</span>
              </td>
              <td className={styles.cell}>
                {(category.phoneModels || []).slice(0, 2).join(", ") || "-"}
                {(category.phoneModels || []).length > 2 ? " +" + ((category.phoneModels || []).length - 2) : ""}
              </td>
              <td className={`${styles.cell} ${styles.bold}`}>
                {category.productsAssigned}
              </td>
              <td className={styles.cell}>
                <div className={styles.seoRow}>
                  <div className={styles.seoTrack}>
                    <div
                      className={
                        category.seoScore >= 60
                          ? styles.seoFillActive
                          : styles.seoFillMuted
                      }
                      style={{ width: `${category.seoScore}%` }}
                    />
                  </div>
                  <span className={styles.seoValue}>{category.seoScore}</span>
                </div>
              </td>
              <td className={styles.cell}>
                <span
                  className={
                    category.status === "Active"
                      ? styles.statusActive
                      : styles.statusHidden
                  }
                >
                  {category.status}
                </span>
              </td>
              <td className={`${styles.cell} ${styles.alignRight}`}>
                <div className={styles.menuWrapper}>
                  <button
                    className={styles.menuButton}
                    onClick={() => dispatch(toggleRowMenu(category.id))}
                    aria-label="Row actions"
                  >
                    <MdMoreVert />
                  </button>
                  {activeMenuId === category.id && (
                    <div className={styles.menu}>
                      <button onClick={() => dispatch(openDrawer(category.id))}>
                        <MdEdit /> Edit
                      </button>
                      <button onClick={() => dispatch(hideCategory(category.id))}>
                        {category.status === "Hidden" ? (
                          <>
                            <MdVisibility /> Unhide
                          </>
                        ) : (
                          <>
                            <MdVisibilityOff /> Hide
                          </>
                        )}
                      </button>
                      <button
                        onClick={() =>
                          dispatch(
                            moveCategory({ id: category.id, direction: "up" })
                          )
                        }
                      >
                        <MdArrowUpward /> Move Up
                      </button>
                      <button
                        onClick={() =>
                          dispatch(
                            moveCategory({
                              id: category.id,
                              direction: "down",
                            })
                          )
                        }
                      >
                        <MdArrowDownward /> Move Down
                      </button>
                      <button
                        className={styles.menuDanger}
                        onClick={() => setDeleteTarget(category)}
                      >
                        <MdDelete /> Delete
                      </button>
                    </div>
                  )}
                </div>
              </td>
            </tr>
          ))}
          {filtered.length === 0 && (
            <tr>
              <td colSpan={8} className={styles.emptyCell}>
                No categories match your filters.
              </td>
            </tr>
          )}
        </tbody>
      </table>

      <ConfirmModal
        open={Boolean(deleteTarget)}
        title="Delete this category?"
        message={
          deleteTarget && deleteTarget.productsAssigned > 0
            ? `${deleteTarget.productsAssigned} product(s) are currently assigned to "${deleteTarget.name}". Deleting it will leave them uncategorized unless reassigned first. This action cannot be undone.`
            : "This action cannot be undone."
        }
        confirmLabel="Confirm Delete"
        danger
        onCancel={() => setDeleteTarget(null)}
        onConfirm={() => {
          dispatch(deleteCategory(deleteTarget.id));
          setDeleteTarget(null);
        }}
      />
    </div>
  );
};

export default CategoriesTable;
