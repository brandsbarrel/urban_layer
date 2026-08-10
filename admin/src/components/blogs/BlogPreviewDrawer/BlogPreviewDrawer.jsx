import React from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { MdClose, MdEdit, MdVisibility, MdDelete } from "react-icons/md";
import { closePreview, setDeleteTarget, confirmDelete } from "../../../redux/slices/blogsSlice";
import ConfirmModal from "../../common/ConfirmModal/ConfirmModal";
import styles from "./BlogPreviewDrawer.module.css";

const BlogPreviewDrawer = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const previewId = useSelector((state) => state.blogs.previewId);
  const deleteTargetId = useSelector((state) => state.blogs.deleteTargetId);
  const blog = useSelector((state) => state.blogs.items.find((b) => b.id === previewId));
  const isOpen = Boolean(blog);

  return (
    <>
      <div className={`${styles.overlay} ${isOpen ? styles.overlayOpen : ""}`} onClick={() => dispatch(closePreview())} />
      <div className={`${styles.drawer} ${isOpen ? styles.drawerOpen : ""}`}>
        {blog && (
          <>
            <div className={styles.header}>
              <h3 className={styles.title}>Article Preview</h3>
              <button className={styles.closeButton} onClick={() => dispatch(closePreview())}>
                <MdClose />
              </button>
            </div>
            <div className={styles.body}>
              <div className={styles.hero}>
                <img src={blog.featuredImage} alt={blog.title} />
              </div>
              <span className={styles.categoryTag}>{blog.category}</span>
              <h2 className={styles.articleTitle}>{blog.title}</h2>
              <div className={styles.metaRow}>
                <div className={styles.authorBlock}>
                  <div className={styles.avatarInitials}>{blog.author.initials}</div>
                  <div>
                    <p className={styles.authorName}>{blog.author.name}</p>
                    <p className={styles.authorRole}>{blog.author.role}</p>
                  </div>
                </div>
                <div className={styles.divider} />
                <div>
                  <p className={styles.dateText}>{blog.publishedDate || "Not yet published"}</p>
                  <p className={styles.statusText}>{blog.status}</p>
                </div>
              </div>

              <div className={styles.section}>
                <h4 className={styles.sectionLabel}>SEO Performance</h4>
                <div className={styles.seoGrid}>
                  <div className={styles.seoBox}>
                    <p className={styles.seoBoxLabel}>Optimization</p>
                    <p className={styles.seoBoxValuePrimary}>{blog.seoScore}%</p>
                  </div>
                  <div className={styles.seoBox}>
                    <p className={styles.seoBoxLabel}>Readability</p>
                    <p className={styles.seoBoxValue}>
                      {blog.seoScore >= 90 ? "Excellent" : blog.seoScore >= 70 ? "Good" : "Needs Work"}
                    </p>
                  </div>
                </div>
              </div>

              <div className={styles.section}>
                <h4 className={styles.sectionLabel}>Top Keywords</h4>
                <div className={styles.tagList}>
                  {blog.tags.map((tag) => (
                    <span key={tag} className={styles.tagPill}>
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>

              <div className={styles.section}>
                <h4 className={styles.sectionLabel}>Article Metrics</h4>
                <div className={styles.metricsList}>
                  <div className={styles.metricRow}>
                    <span>Total Page Views</span>
                    <span className={styles.metricValue}>{blog.views ? blog.views.toLocaleString() : "--"}</span>
                  </div>
                  <div className={styles.metricRow}>
                    <span>Avg. Session Duration</span>
                    <span className={styles.metricValue}>{blog.avgSessionDuration || "--"}</span>
                  </div>
                  <div className={styles.metricRow}>
                    <span>Bounce Rate</span>
                    <span className={styles.metricValueGreen}>{blog.bounceRate || "--"}</span>
                  </div>
                </div>
              </div>
            </div>
            <div className={styles.footer}>
              <button className={styles.editButton} onClick={() => navigate(`/blogs/edit/${blog.id}`)}>
                <MdEdit /> Edit Article
              </button>
              <button className={styles.iconButton} title="Coming Soon">
                <MdVisibility />
              </button>
              <button className={styles.deleteIconButton} onClick={() => dispatch(setDeleteTarget(blog.id))}>
                <MdDelete />
              </button>
            </div>
          </>
        )}
      </div>

      <ConfirmModal
        open={Boolean(deleteTargetId)}
        title="Delete this article?"
        message="This action cannot be undone."
        confirmLabel="Confirm Delete"
        danger
        onCancel={() => dispatch(setDeleteTarget(null))}
        onConfirm={() => dispatch(confirmDelete())}
      />
    </>
  );
};

export default BlogPreviewDrawer;