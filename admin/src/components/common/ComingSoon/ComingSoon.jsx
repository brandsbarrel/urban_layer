import React from "react";
import { Link } from "react-router-dom";
import { MdConstruction } from "react-icons/md";
import styles from "./ComingSoon.module.css";

// Renders whenever a section from the Admin Panel workflow has not been
// built yet. Per the workflow's rule, unimplemented features are always
// marked "Coming Soon" rather than faked.
const ComingSoon = ({ featureName }) => {
  return (
    <div className={styles.wrapper}>
      <MdConstruction className={styles.icon} />
      <h2 className={styles.title}>{featureName} — Coming Soon</h2>
      <p className={styles.description}>
        This section will be available once its design and workflow are
        implemented.
      </p>
      <Link to="/" className={styles.backLink}>
        Back to Dashboard
      </Link>
    </div>
  );
};

export default ComingSoon;