import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { MdUpload, MdDownload, MdAdd } from "react-icons/md";
import { fetchCategories, openDrawer } from "../../redux/slices/categoriesSlice";
import CategoryStatsRow from "../../components/categories/CategoryStatsRow/CategoryStatsRow";
import CategoryToolbar from "../../components/categories/CategoryToolbar/CategoryToolbar";
import CategoriesTable from "../../components/categories/CategoriesTable/CategoriesTable";
import CategoryPreviewPanel from "../../components/categories/CategoryPreviewPanel/CategoryPreviewPanel";
import AddCategoryDrawer from "../../components/categories/AddCategoryDrawer/AddCategoryDrawer";
import styles from "./Categories.module.css";

const Categories = () => {
  const dispatch = useDispatch();
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);

  React.useEffect(() => {
    if (isAuthenticated) {
      dispatch(fetchCategories());
    }
  }, [dispatch, isAuthenticated]);

  return (
    <div className={styles.page}>
      <div className={styles.pageHeader}>
        <div>
          <h2 className={styles.title}>Categories</h2>
          <p className={styles.subtitle}>
            Manage your brand's navigational structure and product hierarchy.
          </p>
        </div>
        <div className={styles.headerActions}>
          <button className={styles.secondaryButton} title="Integration Required">
            <MdUpload /> Import
          </button>
          <button className={styles.secondaryButton} title="Integration Required">
            <MdDownload /> Export
          </button>
          <button
            className={styles.primaryButton}
            onClick={() => dispatch(openDrawer())}
          >
            <MdAdd /> Add Category
          </button>
        </div>
      </div>

      <CategoryStatsRow />

      <div className={styles.workspace}>
        <div className={styles.tableCard}>
          <CategoryToolbar />
          <CategoriesTable />
        </div>
        <CategoryPreviewPanel />
      </div>

      <AddCategoryDrawer />
    </div>
  );
};

export default Categories;
