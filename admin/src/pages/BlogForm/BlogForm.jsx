import React, { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { loadForExisting, resetForNew, markSaved } from "../../redux/slices/blogFormSlice";
import { upsertBlog, setDeleteTarget, confirmDelete } from "../../redux/slices/blogsSlice";
import BlogFormHeader from "../../components/blogForm/BlogFormHeader/BlogFormHeader";
import BasicInfoSection from "../../components/blogForm/BasicInfoSection/BasicInfoSection";
import FeaturedImageSection from "../../components/blogForm/FeaturedImageSection/FeaturedImageSection";
import SEOSection from "../../components/blogForm/SEOSection/SEOSection";
import PublishSettingsPanel from "../../components/blogForm/PublishSettingsPanel/PublishSettingsPanel";
import BlogStickyActionBar from "../../components/blogForm/BlogStickyActionBar/BlogStickyActionBar";
import ConfirmModal from "../../components/common/ConfirmModal/ConfirmModal";
import styles from "./BlogForm.module.css";

const BlogForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const existingBlog = useSelector((state) => (id ? state.blogs.items.find((b) => b.id === id) : null));
  const form = useSelector((state) => state.blogForm.form);
  const isDirty = useSelector((state) => state.blogForm.isDirty);
  const [discardConfirmOpen, setDiscardConfirmOpen] = React.useState(false);

  useEffect(() => {
    if (id && existingBlog) {
      dispatch(loadForExisting(existingBlog));
    } else {
      dispatch(resetForNew());
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  // Preview: opens a read-only view without changing status, per Section 25.
  const handlePreview = () => {
    window.alert(
      "Preview: this opens a read-only view of the article without publishing. (Storefront preview integration required.)"
    );
  };

  const handleSaveDraft = () => {
    if (!form.title.trim()) {
      window.alert("Title is required to save a draft.");
      return;
    }
    dispatch(upsertBlog({ ...form, status: "Draft", publiclyVisible: false }));
    dispatch(markSaved());
    navigate("/blogs");
  };

  const handlePublish = () => {
    if (!form.title.trim() || !form.category || !form.content.trim()) {
      window.alert("Title, Category, and Content are required to publish.");
      return;
    }
    dispatch(
      upsertBlog({
        ...form,
        status: "Published",
        publiclyVisible: true,
        publishedDate: new Date().toLocaleDateString("en-US", { month: "long", day: "2-digit", year: "numeric" }),
      })
    );
    dispatch(markSaved());
    navigate("/blogs");
  };

  const handleSchedule = (dateTime) => {
    if (!form.title.trim() || !form.category || !form.content.trim()) {
      window.alert("Title, Category, and Content are required to schedule.");
      return;
    }
    dispatch(
      upsertBlog({ ...form, status: "Scheduled", publiclyVisible: false, scheduledDate: dateTime })
    );
    dispatch(markSaved());
    navigate("/blogs");
  };

  const handleArchive = () => {
    dispatch(upsertBlog({ ...form, status: "Archived", publiclyVisible: false }));
    dispatch(markSaved());
    navigate("/blogs");
  };

  const handleDelete = () => {
    dispatch(setDeleteTarget(form.id));
    dispatch(confirmDelete());
    navigate("/blogs");
  };

  const handleDiscardClick = () => {
    if (isDirty) {
      setDiscardConfirmOpen(true);
    } else {
      navigate("/blogs");
    }
  };

  return (
    <div className={styles.page}>
      <BlogFormHeader onPreview={handlePreview} onSaveDraft={handleSaveDraft} onPublish={handlePublish} />

      <div className={styles.grid}>
        <div className={styles.leftColumn}>
          <BasicInfoSection />
          <SEOSection />
        </div>
        <div className={styles.rightColumn}>
          <FeaturedImageSection />
          <PublishSettingsPanel />
        </div>
      </div>

      <BlogStickyActionBar
        onSchedule={handleSchedule}
        onArchive={handleArchive}
        onDelete={handleDelete}
        isExisting={Boolean(id)}
      />

      <ConfirmModal
        open={discardConfirmOpen}
        title="Discard unsaved changes?"
        message="Your unsaved changes to this article will be lost."
        confirmLabel="Discard"
        danger
        onCancel={() => setDiscardConfirmOpen(false)}
        onConfirm={() => {
          setDiscardConfirmOpen(false);
          navigate("/blogs");
        }}
      />
    </div>
  );
};

export default BlogForm;