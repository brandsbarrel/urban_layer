import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { MdAdd, MdClose, MdDelete, MdEdit, MdImage, MdPhoneIphone, MdToggleOff, MdToggleOn, MdUpload } from "react-icons/md";
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
  sortOrder: 0,
  image: "",
  active: true
};

const readFileAsDataUrl = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });

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

  const handleImageSelect = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) return;

    try {
      const dataUrl = await readFileAsDataUrl(file);
      setForm((prev) => ({ ...prev, image: dataUrl }));
    } catch {
      // ignore
    } finally {
      event.target.value = "";
    }
  };

  const resetForm = () => setForm(emptyForm);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const payload = {
      brand: form.brand.trim(),
      name: form.name.trim(),
      slug: form.slug.trim() || slugify(`${form.brand} ${form.name}`),
      sortOrder: Number(form.sortOrder) || 0,
      image: form.image || "",
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
          <h2 className={pageStyles.title}>Devices &amp; Phone Models</h2>
          <p className={pageStyles.subtitle}>Manage supported devices for product compatibility, filters, and device showcase.</p>
        </div>
      </div>

      <form className={toolbarStyles.row} style={{ flexWrap: "wrap", gap: "10px" }} onSubmit={handleSubmit}>
        <input className={toolbarStyles.select} placeholder="Brand (e.g. Apple)" value={form.brand} onChange={set("brand")} required />
        <input className={toolbarStyles.select} placeholder="Model name (e.g. iPhone 15 Pro)" value={form.name} onChange={set("name")} required />
        <input className={toolbarStyles.select} placeholder="Slug (optional)" value={form.slug} onChange={set("slug")} />
        <input
          className={toolbarStyles.select}
          type="number"
          min="0"
          placeholder="Order"
          style={{ width: "80px" }}
          value={form.sortOrder}
          onChange={set("sortOrder")}
        />
        <label className={pageStyles.secondaryButton} style={{ cursor: "pointer", display: "inline-flex", alignItems: "center", gap: "6px" }}>
          <MdUpload /> {form.image ? "Change Image" : "Upload Image"}
          <input type="file" accept="image/*" style={{ display: "none" }} onChange={handleImageSelect} />
        </label>
        {form.image && (
          <div style={{ width: "36px", height: "36px", borderRadius: "4px", overflow: "hidden", border: "1px solid #ddd" }}>
            <img src={form.image} alt="Thumb" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          </div>
        )}
        <button className={pageStyles.primaryButton} type="submit">
          <MdAdd /> {form.id ? "Update Device" : "Add Device"}
        </button>
        {form.id && (
          <button className={pageStyles.secondaryButton} type="button" onClick={resetForm}>
            <MdClose /> Cancel
          </button>
        )}
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
                <th className={tableStyles.headCell} style={{ width: "60px" }}>Image</th>
                <th className={tableStyles.headCell}>Brand</th>
                <th className={tableStyles.headCell}>Model</th>
                <th className={tableStyles.headCell}>Slug</th>
                <th className={tableStyles.headCell}>Order</th>
                <th className={tableStyles.headCell}>Products</th>
                <th className={tableStyles.headCell}>Status</th>
                <th className={`${tableStyles.headCell} ${tableStyles.alignRight}`}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading && (
                <tr>
                  <td colSpan={8} className={tableStyles.emptyCell}>Loading devices...</td>
                </tr>
              )}
              {!loading && error && (
                <tr>
                  <td colSpan={8} className={tableStyles.emptyCell}>Unable to load devices.</td>
                </tr>
              )}
              {!loading && !error && items.map((phoneModel) => (
                <tr key={phoneModel.id} className={tableStyles.row}>
                  <td className={tableStyles.cell}>
                    <div style={{ width: "36px", height: "36px", borderRadius: "4px", overflow: "hidden", background: "#f0f0f0", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      {phoneModel.image ? (
                        <img src={phoneModel.image} alt={phoneModel.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                      ) : (
                        <MdPhoneIphone style={{ fontSize: "20px", color: "#aaa" }} />
                      )}
                    </div>
                  </td>
                  <td className={tableStyles.cell}>{phoneModel.brand}</td>
                  <td className={`${tableStyles.cell} ${tableStyles.bold}`}>{phoneModel.name}</td>
                  <td className={tableStyles.cell}>
                    <span className={tableStyles.slug}>/{phoneModel.slug}</span>
                  </td>
                  <td className={tableStyles.cell}>{phoneModel.sortOrder ?? 0}</td>
                  <td className={`${tableStyles.cell} ${tableStyles.bold}`} title="Dynamically computed count of published products">{phoneModel.productsAssigned ?? 0}</td>
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
                        onClick={() =>
                          setForm({
                            id: phoneModel.id,
                            brand: phoneModel.brand || "",
                            name: phoneModel.name || "",
                            slug: phoneModel.slug || "",
                            sortOrder: phoneModel.sortOrder ?? 0,
                            image: phoneModel.image || "",
                            active: phoneModel.active !== false
                          })
                        }
                        aria-label="Edit"
                        title="Edit device"
                      >
                        <MdEdit />
                      </button>
                      <button
                        className={tableStyles.menuButton}
                        type="button"
                        onClick={() => dispatch(togglePhoneModelActive(phoneModel.id))}
                        aria-label="Toggle active"
                        title={phoneModel.active ? "Deactivate" : "Activate"}
                      >
                        {phoneModel.active ? <MdToggleOn /> : <MdToggleOff />}
                      </button>
                      <button
                        className={tableStyles.menuButton}
                        type="button"
                        onClick={() => setDeleteTarget(phoneModel)}
                        aria-label="Delete"
                        title="Delete device"
                      >
                        <MdDelete />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {!loading && !error && items.length === 0 && (
                <tr>
                  <td colSpan={8} className={tableStyles.emptyCell}>No devices found.</td>
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
