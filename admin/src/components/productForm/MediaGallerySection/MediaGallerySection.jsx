import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { MdAddPhotoAlternate, MdClose } from "react-icons/md";
import { updateField } from "../../../redux/slices/productFormSlice";
import styles from "./MediaGallerySection.module.css";

const readFileAsDataUrl = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });

const MediaGallerySection = () => {
  const dispatch = useDispatch();
  const form = useSelector((state) => state.productForm.form);
  const [reading, setReading] = React.useState(false);

  const images = [form.featuredImage, ...form.galleryImages].filter(Boolean);

  const setImages = (nextImages) => {
    const [featuredImage = "", ...galleryImages] = nextImages;
    dispatch(updateField({ field: "featuredImage", value: featuredImage }));
    dispatch(updateField({ field: "galleryImages", value: galleryImages }));
  };

  const handleSelectImages = async (event) => {
    const files = Array.from(event.target.files || []).filter((file) =>
      file.type.startsWith("image/")
    );

    if (files.length === 0) {
      return;
    }

    setReading(true);
    try {
      const selectedImages = await Promise.all(files.map(readFileAsDataUrl));
      setImages([...images, ...selectedImages]);
    } finally {
      setReading(false);
      event.target.value = "";
    }
  };

  const removeImage = (index) => {
    setImages(images.filter((_, imageIndex) => imageIndex !== index));
  };

  return (
    <section className={styles.card}>
      <div className={styles.headerRow}>
        <h3 className={styles.title}>
          <MdAddPhotoAlternate /> Product Images
        </h3>
        <span className={styles.hint}>Selection order is maintained</span>
      </div>

      <label className={styles.uploadButton}>
        {reading ? "Reading Images..." : "Upload Picture"}
        <input
          type="file"
          accept="image/*"
          multiple
          disabled={reading}
          onChange={handleSelectImages}
        />
      </label>

      {images.length > 0 ? (
        <div className={styles.previewGrid}>
          {images.map((image, index) => (
            <div className={styles.previewCard} key={`${image.slice(0, 40)}-${index}`}>
              <img src={image} alt={`Product ${index + 1}`} />
              <button
                className={styles.removeButton}
                type="button"
                aria-label="Remove image"
                onClick={() => removeImage(index)}
              >
                <MdClose />
              </button>
              {index === 0 && <span className={styles.featuredBadge}>Featured</span>}
              <span className={styles.orderBadge}>{index + 1}</span>
            </div>
          ))}
        </div>
      ) : (
        <div className={styles.emptySlot}>
          Select one or multiple product images
        </div>
      )}
    </section>
  );
};

export default MediaGallerySection;
