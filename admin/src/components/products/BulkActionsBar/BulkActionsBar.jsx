import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  MdPublish,
  MdUpdate,
  MdFileDownload,
  MdArchive,
  MdDelete,
} from "react-icons/md";
import {
  archiveSelected,
  deleteProducts,
} from "../../../redux/slices/productsSlice";
import ConfirmModal from "../../common/ConfirmModal/ConfirmModal";
import styles from "./BulkActionsBar.module.css";

const BulkActionsBar = () => {
  const dispatch = useDispatch();
  const selectedIds = useSelector((state) => state.products.selectedIds);
  const [confirmOpen, setConfirmOpen] = useState(false);

  if (selectedIds.length === 0) return null;

  return (
    <div className={styles.bar}>
      <div className={styles.left}>
        <span className={styles.count}>
          {selectedIds.length} item{selectedIds.length > 1 ? "s" : ""}{" "}
          selected
        </span>
        <div className={styles.divider} />
        <div className={styles.actions}>
          <button className={styles.actionButton} title="Integration Required">
            <MdPublish /> Publish
          </button>
          <button className={styles.actionButton} title="Integration Required">
            <MdUpdate /> Update Stock
          </button>
          <button className={styles.actionButton} title="Integration Required">
            <MdFileDownload /> Export Selected
          </button>
          <button
            className={styles.actionButton}
            onClick={() => dispatch(archiveSelected())}
          >
            <MdArchive /> Archive Selected
          </button>
        </div>
      </div>
      <button
        className={styles.deleteButton}
        onClick={() => setConfirmOpen(true)}
      >
        <MdDelete /> Delete
      </button>

      <ConfirmModal
        open={confirmOpen}
        title="Delete selected products?"
        message="This action may affect store data. Deleted products cannot be recovered."
        confirmLabel="Confirm Delete"
        danger
        onCancel={() => setConfirmOpen(false)}
        onConfirm={() => {
          dispatch(deleteProducts(selectedIds));
          setConfirmOpen(false);
        }}
      />
    </div>
  );
};

export default BulkActionsBar;