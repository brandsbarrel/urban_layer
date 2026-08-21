import React from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  MdEditNote,
} from "react-icons/md";
import { updateField } from "../../../redux/slices/productFormSlice";
import styles from "./BasicInfoSection.module.css";

const BasicInfoSection = () => {
  const dispatch = useDispatch();
  const form = useSelector((state) => state.productForm.form);
  const phoneModels = useSelector((state) => state.phoneModels.items);
  const selectedPhoneModel = phoneModels.find((phoneModel) => phoneModel.id === form.phoneModelId);
  const [phoneModelSearch, setPhoneModelSearch] = React.useState("");

  React.useEffect(() => {
    if (selectedPhoneModel) {
      setPhoneModelSearch(`${selectedPhoneModel.brand} ${selectedPhoneModel.name}`);
    }
  }, [selectedPhoneModel]);

  const set = (field) => (e) =>
    dispatch(updateField({ field, value: e.target.value }));

  return (
    <section className={styles.card}>
      <div className={styles.headerRow}>
        <h3 className={styles.title}>
          <MdEditNote /> Basic Information
        </h3>
        <span className={styles.requiredBadge}>Required</span>
      </div>

      <div className={styles.fieldGroup}>
        <label className={styles.label}>Product Name</label>
        <input
          className={styles.input}
          type="text"
          placeholder="e.g. Smoke Case for iPhone 16 Pro"
          value={form.name}
          onChange={set("name")}
        />
      </div>

      <div className={styles.twoCol}>
        <div className={styles.fieldGroup}>
          <label className={styles.label}>Phone Model</label>
          <input
            className={styles.input}
            type="text"
            list="phone-model-options"
            placeholder="Search phone model..."
            value={phoneModelSearch}
            onChange={(event) => {
              const value = event.target.value;
              const matched = phoneModels.find((phoneModel) => `${phoneModel.brand} ${phoneModel.name}` === value);

              setPhoneModelSearch(value);
              dispatch(updateField({ field: "phoneModelId", value: matched?.id || "" }));
            }}
          />
          <datalist id="phone-model-options">
            {phoneModels.map((phoneModel) => (
              <option key={phoneModel.id} value={`${phoneModel.brand} ${phoneModel.name}`} />
            ))}
          </datalist>
        </div>
        <div className={styles.fieldGroup}>
          <label className={styles.label}>SKU Reference</label>
          <input
            className={`${styles.input} ${styles.uppercase}`}
            type="text"
            placeholder="ULC-CRB-001"
            value={form.sku}
            onChange={set("sku")}
          />
        </div>
      </div>

      <div className={styles.fieldGroup}>
        <label className={styles.label}>Description</label>
        <textarea
          className={styles.textarea}
          rows={5}
          placeholder="Short product details, finish, grip, protection level..."
          value={form.description}
          onChange={set("description")}
        />
      </div>
    </section>
  );
};

export default BasicInfoSection;
