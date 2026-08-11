import React from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { MdMoreVert } from "react-icons/md";
import { openPreview } from "../../../redux/slices/blogsSlice";
import styles from "./BlogsTable.module.css";

const STATUS_CLASS = { Published: "statusPublished", Draft: "statusDraft", Scheduled: "statusScheduled", Archived: "statusArchived" };

const BlogsTable = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { items, searchQuery, statusFilter, categoryFilter, authorFilter } = useSelector(
    (state) => state.blogs
  );

  const query = searchQuery.trim().toLowerCase();
  const filtered = items.filter((b) => {
    const matchesQuery = !query || b.title.toLowerCase().includes(query) || b.tags.some((t) => t.toLowerCase().includes(query));
    const matchesStatus = statusFilter === "All" || b.status === statusFilter;
    const matchesCategory = categoryFilter === "All" || b.category === categoryFilter;
    const matchesAuthor = authorFilter === "All" || b.author.name === authorFilter;
    return matchesQuery && matchesStatus && matchesCategory && matchesAuthor;
  });

  return (
    <div className={styles.tableWrapper}>
      <table className={styles.table}>
        <thead>
          <tr className={styles.headRow}>
            <th className={styles.headCell}>Article</th>
            <th className={styles.headCell}>Author</th>
            <th className={styles.headCell}>Category</th>
            <th className={`${styles.headCell} ${styles.alignCenter}`}>SEO Score</th>
            <th className={styles.headCell}>Status</th>
            <th className={`${styles.headCell} ${styles.alignRight}`}>Views</th>
            <th className={styles.headCell}></th>
          </tr>
        </thead>
        <tbody>
          {filtered.map((blog) => (
            <tr key={blog.id} className={styles.row} onClick={() => dispatch(openPreview(blog.id))}>
              <td className={styles.cell}>
                <div className={styles.articleCol}>
                  <div className={styles.thumb}>
                    <img src={blog.thumbnail} alt={blog.title} />
                  </div>
                  <div>
                    <p className={styles.articleTitle}>{blog.title}</p>
                    <p className={styles.updatedAt}>Updated {blog.updatedAt}</p>
                  </div>
                </div>
              </td>
              <td className={styles.cell}>
                <div className={styles.authorCol}>
                  <div className={styles.avatarInitials}>{blog.author.initials}</div>
                  <span className={styles.authorName}>{blog.author.name}</span>
                </div>
              </td>
              <td className={styles.cell}>
                <span className={styles.categoryPill}>{blog.category}</span>
              </td>
              <td className={`${styles.cell} ${styles.alignCenter}`}>
                <span className={styles.seoBadge}>{blog.seoScore}</span>
              </td>
              <td className={styles.cell}>
                <span className={`${styles.statusText} ${styles[STATUS_CLASS[blog.status]]}`}>
                  <span className={styles.statusDot} /> {blog.status}
                </span>
              </td>
              <td className={`${styles.cell} ${styles.alignRight}`}>
                {blog.views ? blog.views.toLocaleString() : "--"}
              </td>
              <td className={`${styles.cell} ${styles.alignRight}`}>
                <button
                  className={styles.moreButton}
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate(`/blogs/edit/${blog.id}`);
                  }}
                  aria-label="Edit article"
                >
                  <MdMoreVert />
                </button>
              </td>
            </tr>
          ))}
          {filtered.length === 0 && (
            <tr>
              <td colSpan={7} className={styles.emptyCell}>
                No articles match your filters.
              </td>
            </tr>
          )}
        </tbody>
      </table>
      <div className={styles.footer}>
        <span>Showing 1-{filtered.length} of 1,248 articles</span>
      </div>
    </div>
  );
};

export default BlogsTable;