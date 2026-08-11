import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  MdMail,
  MdDownload,
  MdVerifiedUser,
  MdDelete,
  MdBlock,
} from "react-icons/md";
import {
  toggleSelectAll,
  deactivateSelected,
  deleteSelected,
} from "../../../redux/slices/customersSlice";
import ConfirmModal from "../../common/ConfirmModal/ConfirmModal";
import styles from "./BulkCustomerActionsBar.module.css";

const BulkCustomerActionsBar = ({ allIds }) => {
  const dispatch = useDispatch();
  const selectedIds = useSelector((state) => state.customers.selectedIds);
  const allSelected =
    allIds.length > 0 && allIds.every((id) => selectedIds.includes(id));
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [deactivateConfirmOpen, setDeactivateConfirmOpen] = useState(false);

  return (
    <div className={styles.bar}>
      <div className={styles.left}>
        <label className={styles.selectAll}>
          <input
            type="checkbox"
            checked={allSelected}
            onChange={() => dispatch(toggleSelectAll(allIds))}
          />
          Select All
        </label>
        <div className={styles.divider} />
        <div className={styles.actions}>
          <button className={styles.actionButton} title="Integration Required">
            <MdMail /> Email
          </button>
          <button className={styles.actionButton} title="Integration Required">
            <MdDownload /> Export
          </button>
          <button className={styles.actionButton} title="Integration Required">
            <MdVerifiedUser /> Verify
          </button>
          <button
            className={styles.actionButton}
            disabled={selectedIds.length === 0}
            onClick={() => setDeactivateConfirmOpen(true)}
          >
            <MdBlock /> Deactivate
          </button>
          <button
            className={styles.deleteButton}
            disabled={selectedIds.length === 0}
            onClick={() => setDeleteConfirmOpen(true)}
          >
            <MdDelete /> Delete
          </button>
        </div>
      </div>
      <span className={styles.countText}>
        Showing 1-{allIds.length} of 12,482
      </span>

      <ConfirmModal
        open={deactivateConfirmOpen}
        title="Deactivate selected customers?"
        message="Their accounts will be disabled and they will not be able to log in."
        confirmLabel="Confirm Deactivate"
        danger
        onCancel={() => setDeactivateConfirmOpen(false)}
        onConfirm={() => {
          dispatch(deactivateSelected());
          setDeactivateConfirmOpen(false);
        }}
      />
      <ConfirmModal
        open={deleteConfirmOpen}
        title="Delete selected customers?"
        message="This action cannot be undone and follows your data retention policy."
        confirmLabel="Confirm Delete"
        danger
        onCancel={() => setDeleteConfirmOpen(false)}
        onConfirm={() => {
          dispatch(deleteSelected());
          setDeleteConfirmOpen(false);
        }}
      />
    </div>
  );
};

export default BulkCustomerActionsBar;