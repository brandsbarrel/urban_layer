import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  MdAdd,
  MdArrowDownward,
  MdArrowUpward,
  MdClose,
  MdDelete,
  MdEdit,
  MdImage,
  MdToggleOff,
  MdToggleOn,
  MdUpload
} from "react-icons/md";
import ConfirmModal from "../../components/common/ConfirmModal/ConfirmModal";
import {
  closeFormModal,
  createHeroSlide,
  deleteHeroSlide,
  fetchHeroSlides,
  openCreateModal,
  openEditModal,
  reorderHeroSlide,
  setHeroSlidePage,
  toggleHeroSlideActive,
  updateHeroSlide
} from "../../redux/slices/heroSlidesSlice";
import styles from "./HeroSlides.module.css";

const initialFormData = {
  title: "",
  subtitle: "",
  ctaText: "",
  ctaLink: "",
  backgroundImage: "",
  order: 0,
  isActive: true,
  startDate: "",
  endDate: ""
};

const readFileAsDataUrl = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });

const formatDate = (isoString) => {
  if (!isoString) return "-";
  try {
    const d = new Date(isoString);
    return d.toLocaleDateString("en-IN", {
      year: "numeric",
      month: "short",
      day: "numeric"
    });
  } catch {
    return isoString;
  }
};

const toInputDateFormat = (isoString) => {
  if (!isoString) return "";
  try {
    return new Date(isoString).toISOString().split("T")[0];
  } catch {
    return "";
  }
};

const HeroSlides = () => {
  const dispatch = useDispatch();
  const {
    items,
    loading,
    error,
    page,
    totalPages,
    totalItems,
    formModalOpen,
    editingSlide
  } = useSelector((state) => state.heroSlides);

  const [form, setForm] = useState(initialFormData);
  const [formError, setFormError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);

  useEffect(() => {
    dispatch(fetchHeroSlides());
  }, [dispatch, page]);

  useEffect(() => {
    if (editingSlide) {
      setForm({
        title: editingSlide.title || "",
        subtitle: editingSlide.subtitle || "",
        ctaText: editingSlide.ctaText || "",
        ctaLink: editingSlide.ctaLink || "",
        backgroundImage: editingSlide.backgroundImage || "",
        order: editingSlide.order ?? 0,
        isActive: editingSlide.isActive !== false,
        startDate: toInputDateFormat(editingSlide.startDate),
        endDate: toInputDateFormat(editingSlide.endDate)
      });
      setFormError("");
    } else {
      setForm({
        ...initialFormData,
        order: items.length
      });
      setFormError("");
    }
  }, [editingSlide, formModalOpen, items.length]);

  const setField = (field) => (event) => {
    const val = event.target.type === "checkbox" ? event.target.checked : event.target.value;
    setForm((prev) => ({ ...prev, [field]: val }));
  };

  const handleImageFile = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setFormError("Only image files are supported.");
      return;
    }

    try {
      const dataUrl = await readFileAsDataUrl(file);
      setForm((prev) => ({ ...prev, backgroundImage: dataUrl }));
      setFormError("");
    } catch {
      setFormError("Failed to read image file.");
    } finally {
      event.target.value = "";
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title.trim()) {
      setFormError("Title is required.");
      return;
    }

    setSubmitting(true);
    setFormError("");

    const payload = {
      title: form.title.trim(),
      subtitle: form.subtitle.trim(),
      ctaText: form.ctaText.trim(),
      ctaLink: form.ctaLink.trim(),
      backgroundImage: form.backgroundImage.trim(),
      order: Number(form.order) || 0,
      isActive: Boolean(form.isActive),
      startDate: form.startDate ? new Date(form.startDate).toISOString() : null,
      endDate: form.endDate ? new Date(form.endDate).toISOString() : null
    };

    try {
      if (editingSlide) {
        await dispatch(updateHeroSlide({ id: editingSlide.id, ...payload })).unwrap();
      } else {
        await dispatch(createHeroSlide(payload)).unwrap();
      }
    } catch (err) {
      setFormError(err.message || "Failed to save slide.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleMove = async (index, direction) => {
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= items.length) return;

    const currentSlide = items[index];
    const targetSlide = items[targetIndex];

    const currentOrder = currentSlide.order;
    const targetOrder = targetSlide.order === currentOrder
      ? (direction === "up" ? currentOrder - 1 : currentOrder + 1)
      : targetSlide.order;

    await dispatch(reorderHeroSlide({ id: currentSlide.id, order: targetOrder }));
    await dispatch(reorderHeroSlide({ id: targetSlide.id, order: currentOrder }));
    dispatch(fetchHeroSlides());
  };

  const activeCount = items.filter((s) => s.isActive).length;

  return (
    <div className={styles.page}>
      <div className={styles.pageHeader}>
        <div>
          <h2 className={styles.title}>Hero Slider</h2>
          <p className={styles.subtitle}>
            Manage homepage carousel slides, promotional banners, and hero calls-to-action.
          </p>
        </div>
        <div className={styles.headerActions}>
          <button
            className={styles.primaryButton}
            type="button"
            onClick={() => dispatch(openCreateModal())}
          >
            <MdAdd /> Add Hero Slide
          </button>
        </div>
      </div>

      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <p className={styles.statLabel}>Total Slides</p>
          <p className={styles.statValue}>{items.length}</p>
        </div>
        <div className={styles.statCard}>
          <p className={styles.statLabel}>Active Slides</p>
          <p className={styles.statValue}>{activeCount}</p>
        </div>
        <div className={styles.statCard}>
          <p className={styles.statLabel}>Scheduled / Date-bounded</p>
          <p className={styles.statValue}>
            {items.filter((s) => s.startDate || s.endDate).length}
          </p>
        </div>
      </div>

      <div className={styles.tableCard}>
        <div className={styles.tableWrapper}>
          <table className={styles.table}>
            <thead>
              <tr className={styles.headRow}>
                <th className={styles.headCell}>Preview</th>
                <th className={styles.headCell}>Title & Subtitle</th>
                <th className={styles.headCell}>Call to Action</th>
                <th className={styles.headCell}>Display Order</th>
                <th className={styles.headCell}>Schedule</th>
                <th className={styles.headCell}>Status</th>
                <th className={`${styles.headCell} ${styles.alignRight}`}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading && items.length === 0 && (
                <tr>
                  <td colSpan={7} className={styles.emptyCell}>
                    Loading hero slides...
                  </td>
                </tr>
              )}
              {!loading && error && items.length === 0 && (
                <tr>
                  <td colSpan={7} className={styles.emptyCell}>
                    {error}
                  </td>
                </tr>
              )}
              {!loading && !error && items.length === 0 && (
                <tr>
                  <td colSpan={7} className={styles.emptyCell}>
                    No hero slides created yet. Click &quot;Add Hero Slide&quot; above to create your first slide.
                  </td>
                </tr>
              )}
              {items.map((slide, index) => (
                <tr key={slide.id} className={styles.row}>
                  <td className={styles.cell}>
                    <div className={styles.thumbSlot}>
                      {slide.backgroundImage ? (
                        <img
                          src={slide.backgroundImage}
                          alt={slide.title}
                          className={styles.thumbImage}
                        />
                      ) : (
                        <MdImage className={styles.thumbPlaceholder} />
                      )}
                    </div>
                  </td>
                  <td className={styles.cell}>
                    <p className={styles.slideTitle}>{slide.title}</p>
                    {slide.subtitle && (
                      <p className={styles.slideSubtitle}>{slide.subtitle}</p>
                    )}
                  </td>
                  <td className={styles.cell}>
                    {slide.ctaText ? (
                      <div>
                        <span className={styles.ctaBadge}>{slide.ctaText}</span>
                        {slide.ctaLink && (
                          <span className={styles.ctaLink}>{slide.ctaLink}</span>
                        )}
                      </div>
                    ) : (
                      <span className={styles.dateRange}>No CTA</span>
                    )}
                  </td>
                  <td className={styles.cell}>
                    <div className={styles.orderControls}>
                      <span className={styles.orderNumber}>{slide.order}</span>
                      <button
                        className={styles.orderButton}
                        type="button"
                        title="Move Up"
                        disabled={index === 0}
                        onClick={() => handleMove(index, "up")}
                      >
                        <MdArrowUpward />
                      </button>
                      <button
                        className={styles.orderButton}
                        type="button"
                        title="Move Down"
                        disabled={index === items.length - 1}
                        onClick={() => handleMove(index, "down")}
                      >
                        <MdArrowDownward />
                      </button>
                    </div>
                  </td>
                  <td className={styles.cell}>
                    <div className={styles.dateRange}>
                      {slide.startDate || slide.endDate ? (
                        <>
                          <div>From: {formatDate(slide.startDate)}</div>
                          <div>To: {formatDate(slide.endDate)}</div>
                        </>
                      ) : (
                        <span>Always active</span>
                      )}
                    </div>
                  </td>
                  <td className={styles.cell}>
                    <span
                      className={
                        slide.isActive ? styles.statusActive : styles.statusHidden
                      }
                    >
                      {slide.isActive ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td className={`${styles.cell} ${styles.alignRight}`}>
                    <div className={styles.actions}>
                      <button
                        className={styles.actionBtn}
                        type="button"
                        title={slide.isActive ? "Deactivate" : "Activate"}
                        onClick={() =>
                          dispatch(
                            toggleHeroSlideActive({
                              id: slide.id,
                              isActive: slide.isActive
                            })
                          )
                        }
                      >
                        {slide.isActive ? <MdToggleOn /> : <MdToggleOff />}
                      </button>
                      <button
                        className={styles.actionBtn}
                        type="button"
                        title="Edit slide"
                        onClick={() => dispatch(openEditModal(slide))}
                      >
                        <MdEdit />
                      </button>
                      <button
                        className={`${styles.actionBtn} ${styles.actionBtnDanger}`}
                        type="button"
                        title="Delete slide"
                        onClick={() => setDeleteTarget(slide)}
                      >
                        <MdDelete />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {totalPages > 1 && (
        <div className={styles.headerActions}>
          <button
            className={styles.secondaryButton}
            type="button"
            disabled={page <= 1}
            onClick={() => dispatch(setHeroSlidePage(page - 1))}
          >
            Previous
          </button>
          <span>
            Page {page} of {totalPages} ({totalItems} slides)
          </span>
          <button
            className={styles.secondaryButton}
            type="button"
            disabled={page >= totalPages}
            onClick={() => dispatch(setHeroSlidePage(page + 1))}
          >
            Next
          </button>
        </div>
      )}

      {/* Create / Edit Modal */}
      {formModalOpen && (
        <div
          className={styles.modalOverlay}
          onClick={() => dispatch(closeFormModal())}
        >
          <div
            className={styles.modal}
            onClick={(e) => e.stopPropagation()}
          >
            <div className={styles.modalHeader}>
              <h3 className={styles.modalTitle}>
                {editingSlide ? "Edit Hero Slide" : "New Hero Slide"}
              </h3>
              <button
                className={styles.modalClose}
                type="button"
                onClick={() => dispatch(closeFormModal())}
              >
                <MdClose />
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className={styles.modalBody}>
                {formError && <p className={styles.errorMessage}>{formError}</p>}

                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Title *</label>
                  <input
                    className={styles.formInput}
                    type="text"
                    placeholder="e.g. Summer Drop 2026"
                    value={form.title}
                    onChange={setField("title")}
                    required
                  />
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Subtitle</label>
                  <input
                    className={styles.formInput}
                    type="text"
                    placeholder="e.g. Exclusive cases engineered for maximum drop resistance"
                    value={form.subtitle}
                    onChange={setField("subtitle")}
                  />
                </div>

                <div className={styles.formRow}>
                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>CTA Text</label>
                    <input
                      className={styles.formInput}
                      type="text"
                      placeholder="e.g. Shop Now"
                      value={form.ctaText}
                      onChange={setField("ctaText")}
                    />
                  </div>
                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>CTA Link</label>
                    <input
                      className={styles.formInput}
                      type="text"
                      placeholder="e.g. /products?tag=summer"
                      value={form.ctaLink}
                      onChange={setField("ctaLink")}
                    />
                  </div>
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Background Image</label>
                  {form.backgroundImage ? (
                    <div className={styles.imagePreviewBox}>
                      <img
                        src={form.backgroundImage}
                        alt="Preview"
                        className={styles.previewImg}
                      />
                    </div>
                  ) : null}
                  <div style={{ display: "flex", gap: "10px", alignItems: "center", marginTop: "6px" }}>
                    <label className={styles.imageUploadBtn}>
                      <MdUpload /> Upload Image
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageFile}
                      />
                    </label>
                    <input
                      className={styles.formInput}
                      style={{ flex: 1 }}
                      type="text"
                      placeholder="Or paste image URL (https://...)"
                      value={form.backgroundImage}
                      onChange={setField("backgroundImage")}
                    />
                  </div>
                </div>

                <div className={styles.formRow}>
                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>Display Order</label>
                    <input
                      className={styles.formInput}
                      type="number"
                      min="0"
                      value={form.order}
                      onChange={setField("order")}
                    />
                  </div>
                  <div className={styles.formGroup} style={{ justifyContent: "flex-end" }}>
                    <label className={styles.checkboxRow}>
                      <input
                        type="checkbox"
                        checked={form.isActive}
                        onChange={setField("isActive")}
                      />
                      <span>Active (Visible on homepage)</span>
                    </label>
                  </div>
                </div>

                <div className={styles.formRow}>
                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>Start Date (Optional)</label>
                    <input
                      className={styles.formInput}
                      type="date"
                      value={form.startDate}
                      onChange={setField("startDate")}
                    />
                  </div>
                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>End Date (Optional)</label>
                    <input
                      className={styles.formInput}
                      type="date"
                      value={form.endDate}
                      onChange={setField("endDate")}
                    />
                  </div>
                </div>
              </div>

              <div className={styles.modalFooter}>
                <button
                  className={styles.secondaryButton}
                  type="button"
                  onClick={() => dispatch(closeFormModal())}
                >
                  Cancel
                </button>
                <button
                  className={styles.primaryButton}
                  type="submit"
                  disabled={submitting}
                >
                  {submitting ? "Saving..." : editingSlide ? "Update Slide" : "Create Slide"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        open={Boolean(deleteTarget)}
        title="Delete hero slide?"
        message={`Are you sure you want to delete "${deleteTarget?.title}"? This action cannot be undone.`}
        confirmLabel="Delete Slide"
        danger
        onCancel={() => setDeleteTarget(null)}
        onConfirm={async () => {
          if (deleteTarget) {
            await dispatch(deleteHeroSlide(deleteTarget.id));
            setDeleteTarget(null);
          }
        }}
      />
    </div>
  );
};

export default HeroSlides;
