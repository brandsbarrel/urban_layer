import React from "react";
import { MdImage, MdZoomIn, MdDelete } from "react-icons/md";
import { useSelector } from "react-redux";
import styles from "./FeaturedImageSection.module.css";

// Real image upload requires file-storage integration not yet available;
// marked Integration Required rather than faked, per the workflow's rules.
const FeaturedImageSection = () => {
  const featuredImage = useSelector((state) => state.blogForm.form.featuredImage);

  return (
    <section className={styles.card}>
      <h3 className={styles.title}>
        <MdImage /> Featured Image
      </h3>
      {featuredImage ? (
        <div className={styles.imageSlot}>
          <img src={featuredImage} alt="Featured" />
          <div className={styles.overlay}>
            <button className={styles.overlayButton} title="Integration Required">
              <MdZoomIn />
            </button>
            <button className={styles.overlayButton} title="Integration Required">
              <MdDelete />
            </button>
          </div>
        </div>
      ) : (
        <div className={styles.uploadSlot} title="Integration Required">
          <MdImage />
          <span>Upload Featured Image</span>
        </div>
      )}
    </section>
  );
};

export default FeaturedImageSection;