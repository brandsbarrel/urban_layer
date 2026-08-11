import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { MdSearch, MdExpandMore, MdTune } from "react-icons/md";
import {
  setSearchQuery,
  setStatusFilter,
  setCategoryFilter,
  setAuthorFilter,
} from "../../../redux/slices/blogsSlice";
import styles from "./BlogToolbar.module.css";

const BlogToolbar = () => {
  const dispatch = useDispatch();
  const { searchQuery, statusFilter, categoryFilter, authorFilter } = useSelector(
    (state) => state.blogs
  );

  return (
    <div className={styles.bar}>
      <div className={styles.searchWrapper}>
        <MdSearch className={styles.searchIcon} />
        <input
          className={styles.searchInput}
          type="text"
          placeholder="Search articles by title, tags, or keywords..."
          value={searchQuery}
          onChange={(e) => dispatch(setSearchQuery(e.target.value))}
        />
      </div>
      <div className={styles.selects}>
        <select className={styles.select} value={statusFilter} onChange={(e) => dispatch(setStatusFilter(e.target.value))}>
          <option value="All">Status</option>
          <option value="Published">Published</option>
          <option value="Draft">Draft</option>
          <option value="Scheduled">Scheduled</option>
          <option value="Archived">Archived</option>
        </select>
        <select className={styles.select} value={categoryFilter} onChange={(e) => dispatch(setCategoryFilter(e.target.value))}>
          <option value="All">Category</option>
          <option value="Craftsmanship">Craftsmanship</option>
          <option value="Lifestyle">Lifestyle</option>
          <option value="Innovation">Innovation</option>
        </select>
        <select className={styles.select} value={authorFilter} onChange={(e) => dispatch(setAuthorFilter(e.target.value))}>
          <option value="All">Author</option>
          <option value="Elias Sterling">Elias Sterling</option>
          <option value="Aria Hayes">Aria Hayes</option>
        </select>
        <button className={styles.tuneButton} title="Coming Soon">
          <MdTune />
        </button>
      </div>
    </div>
  );
};

export default BlogToolbar;