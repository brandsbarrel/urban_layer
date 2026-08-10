import React from "react";
import { Link } from "react-router-dom";
import { MdAddCircle } from "react-icons/md";
import BlogStatsRow from "../../components/blogs/BlogStatsRow/BlogStatsRow";
import BlogToolbar from "../../components/blogs/BlogToolbar/BlogToolbar";
import BlogsTable from "../../components/blogs/BlogsTable/BlogsTable";
import BlogPreviewDrawer from "../../components/blogs/BlogPreviewDrawer/BlogPreviewDrawer";
import styles from "./Blogs.module.css";

const Blogs = () => {
  return (
    <div className={styles.page}>
      <div className={styles.pageHeader}>
        <div>
          <h1 className={styles.title}>Blog Management</h1>
          <p className={styles.subtitle}>
            Create, publish, schedule, and optimize premium blog articles for the Urban Layers global audience.
          </p>
        </div>
        <Link to="/blogs/new" className={styles.quickCreateButton}>
          <MdAddCircle /> Quick Create
        </Link>
      </div>

      <BlogStatsRow />
      <BlogToolbar />
      <BlogsTable />

      <BlogPreviewDrawer />
    </div>
  );
};

export default Blogs;