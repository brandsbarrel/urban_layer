import React from "react";
import { MdZoomIn, MdDelete, MdAddPhotoAlternate, MdVideoCall } from "react-icons/md";
import styles from "./MediaGallerySection.module.css";

const SLOTS = [
  { id: "side", label: "Add Side View", icon: MdAddPhotoAlternate },
  { id: "lifestyle", label: "Add Lifestyle", icon: MdAddPhotoAlternate },
  { id: "detail", label: "Add Detail", icon: MdAddPhotoAlternate },
  { id: "video", label: "Add Video", icon: MdVideoCall },
];

const FEATURED_IMAGE =
  "https://lh3.googleusercontent.com/aida/AP1WRLvHwFa1iVhVbkK3O_RKJyWNv8dIJMma8U07igJB9lKC9-MMi2NszWyoORmk6WCppfyf7qa3utDKbKZC3XznACvlkkyJ6nVjX3yZBHnWL3C9M81meqkLKHhr611Lj7HUZvc0doNWx7BfrceVEjB_5wXrDWfsFUzAFeagSVUfmeqqcqtPzC3znEBgQfteGIj3aMrmla-yqxy9XtfzZg49kqr1Vhc5rwFeG9ByysQhqr8sfno-JSh2mF1oJA";

// Upload/remove/reorder image handlers require real file-storage
// integration, which is not available yet — actions are marked
// "Integration Required" per the workflow's no-fake-functionality rule.
const MediaGallerySection = () => {
  return (
    <section className={styles.card}>
      <div className={styles.headerRow}>
        <h3 className={styles.title}>Media Gallery</h3>
        <button className={styles.linkButton} title="Integration Required">
          Manage Library
        </button>
      </div>
      <div className={styles.grid}>
        <div className={styles.featuredSlot}>
          <img src={FEATURED_IMAGE} alt="Featured product" />
          <div className={styles.overlay}>
            <button className={styles.overlayButton} title="Integration Required">
              <MdZoomIn />
            </button>
            <button className={styles.overlayButton} title="Integration Required">
              <MdDelete />
            </button>
          </div>
          <div className={styles.featuredBadge}>Featured Shot</div>
        </div>
        {SLOTS.map(({ id, label, icon: Icon }) => (
          <div key={id} className={styles.uploadSlot} title="Integration Required">
            <Icon />
            <span>{label}</span>
          </div>
        ))}
      </div>
    </section>
  );
};

export default MediaGallerySection;