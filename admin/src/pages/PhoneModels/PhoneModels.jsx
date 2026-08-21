import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { MdAdd, MdDelete, MdEdit, MdPhoneIphone, MdToggleOff, MdToggleOn } from "react-icons/md";
import ConfirmModal from "../../components/common/ConfirmModal/ConfirmModal";
import {
  addPhoneModel,
  deletePhoneModel,
  fetchPhoneModels,
  setPhoneModelActiveFilter,
  setPhoneModelPage,
  setPhoneModelSearch,
  togglePhoneModelActive,
  updatePhoneModel
} from "../../redux/slices/phoneModelsSlice";
import pageStyles from "../Categories/Categories.module.css";
import tableStyles from "../../components/categories/CategoriesTable/CategoriesTable.module.css";
import toolbarStyles from "../../components/categories/CategoryToolbar/CategoryToolbar.module.css";

const emptyForm = {
  id: null,
  brand: "",
  name: "",
  slug: "",
  active: true
};

const slugify = (value) =>
  value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");

const PhoneModels = () => {
  const dispatch = useDispatch();
  const { items, page, totalPages, totalItems, searchQuery, activeFilter, loading, error } = useSelector(
    (state) => state.phoneModels
  );
  const [form, setForm] = React.useState(emptyForm);
  const [deleteTarget, setDeleteTarget] = React.useState(null);

  React.useEffect(() => {
    dispatch(fetchPhoneModels());
  }, [dispatch, page, searchQuery, activeFilter]);

  const set = (field) => (event) => {
    setForm((prev) => ({ ...prev, [field]: event.target.value }));
  };

  const resetForm = () => setForm(emptyForm);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const payload = {
      brand: form.brand.trim(),
      name: form.name.trim(),
      slug: form.slug.trim() || slugify(`${form.brand} ${form.name}`),
      active: form.active
    };

    if (form.id) {
      await dispatch(updatePhoneModel({ id: form.id, ...payload }));
    } else {
      await dispatch(addPhoneModel(payload));
    }

    resetForm();
  };

  return (
    <div className={pageStyles.page}>
      <div className={pageStyles.pageHeader}>
        <div>
          <h2 className={pageStyles.title}>Phone Models</h2>
          <p className={pageStyles.subtitle}>Manage supported devices for products and storefront filters.</p>
        </div>
      </div>

      <form className={toolbarStyles.row} onSubmit={handleSubmit}>
        <input className={toolbarStyles.select} placeholder="Brand" value={form.brand} onChange={set("brand")} required />
        <input className={toolbarStyles.select} placeholder="Model name" value={form.name} onChange={set("name")} required />
        <input className={toolbarStyles.select} placeholder="Slug" value={form.slug} onChange={set("slug")} />
        <button className={pageStyles.primaryButton} type="submit">
          <MdAdd /> {form.id ? "Update" : "Add"}
        </button>
      </form>

      <div className={pageStyles.tableCard}>
        <div className={toolbarStyles.row}>
          <div className={toolbarStyles.searchWrapper}>
            <MdPhoneIphone className={toolbarStyles.searchIcon} />
            <input
              className={toolbarStyles.searchInput}
              type="text"
              placeholder="Search brand, model, or slug..."
              value={searchQuery}
              onChange={(event) => dispatch(setPhoneModelSearch(event.target.value))}
            />
          </div>
          <select
            className={toolbarStyles.select}
            value={activeFilter}
            onChange={(event) => dispatch(setPhoneModelActiveFilter(event.target.value))}
          >
            <option value="All">All</option>
            <option value="true">Active</option>
            <option value="false">Inactive</option>
          </select>
        </div>

        <div className={tableStyles.tableWrapper}>
          <table className={tableStyles.table}>
            <thead>
              <tr className={tableStyles.headRow}>
                <th className={tableStyles.headCell}>Brand</th>
                <th className={tableStyles.headCell}>Model</th>
                <th className={tableStyles.headCell}>Slug</th>
                <th className={tableStyles.headCell}>Products</th>
                <th className={tableStyles.headCell}>Status</th>
                <th className={`${tableStyles.headCell} ${tableStyles.alignRight}`}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading && (
                <tr>
                  <td colSpan={6} className={tableStyles.emptyCell}>Loading phone models...</td>
                </tr>
              )}
              {!loading && error && (
                <tr>
                  <td colSpan={6} className={tableStyles.emptyCell}>Unable to load phone models.</td>
                </tr>
              )}
              {!loading && !error && items.map((phoneModel) => (
                <tr key={phoneModel.id} className={tableStyles.row}>
                  <td className={tableStyles.cell}>{phoneModel.brand}</td>
                  <td className={`${tableStyles.cell} ${tableStyles.bold}`}>{phoneModel.name}</td>
                  <td className={tableStyles.cell}>
                    <span className={tableStyles.slug}>/{phoneModel.slug}</span>
                  </td>
                  <td className={`${tableStyles.cell} ${tableStyles.bold}`}>{phoneModel.productsAssigned}</td>
                  <td className={tableStyles.cell}>
                    <span className={phoneModel.active ? tableStyles.statusActive : tableStyles.statusHidden}>
                      {phoneModel.active ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td className={`${tableStyles.cell} ${tableStyles.alignRight}`}>
                    <div className={tableStyles.menuWrapper}>
                      <button
                        className={tableStyles.menuButton}
                        type="button"
                        onClick={() => setForm(phoneModel)}
                        aria-label="Edit"
                      >
                        <MdEdit />
                      </button>
                      <button
                        className={tableStyles.menuButton}
                        type="button"
                        onClick={() => dispatch(togglePhoneModelActive(phoneModel.id))}
                        aria-label="Toggle active"
                      >
                        {phoneModel.active ? <MdToggleOn /> : <MdToggleOff />}
                      </button>
                      <button
                        className={tableStyles.menuButton}
                        type="button"
                        onClick={() => setDeleteTarget(phoneModel)}
                        aria-label="Delete"
                      >
                        <MdDelete />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {!loading && !error && items.length === 0 && (
                <tr>
                  <td colSpan={6} className={tableStyles.emptyCell}>No phone models found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {totalPages > 1 && (
        <div className={pageStyles.headerActions}>
          <button
            className={pageStyles.secondaryButton}
            type="button"
            disabled={page <= 1}
            onClick={() => dispatch(setPhoneModelPage(page - 1))}
          >
            Previous
          </button>
          <span>{page} / {totalPages} ({totalItems})</span>
          <button
            className={pageStyles.secondaryButton}
            type="button"
            disabled={page >= totalPages}
            onClick={() => dispatch(setPhoneModelPage(page + 1))}
          >
            Next
          </button>
        </div>
      )}

      <ConfirmModal
        open={Boolean(deleteTarget)}
        title="Delete phone model?"
        message="Phone models linked to products cannot be deleted."
        confirmLabel="Delete"
        danger
        onCancel={() => setDeleteTarget(null)}
        onConfirm={() => {
          dispatch(deletePhoneModel(deleteTarget.id));
          setDeleteTarget(null);
        }}
      />
    </div>
  );
};

export default PhoneModels;
