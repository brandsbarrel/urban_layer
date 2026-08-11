import React, { useState } from "react";
import { useSelector } from "react-redux";
import ScheduleModal from "../ScheduleModal/ScheduleModal";
import ConfirmModal from "../../common/ConfirmModal/ConfirmModal";
import styles from "./BlogStickyActionBar.module.css";

const BlogStickyActionBar = ({ onSchedule, onArchive, onDelete, isExisting }) => {
  const isDirty = useSelector((state) => state.blogForm.isDirty);
  const [scheduleOpen, setScheduleOpen] = useState(false);
  const [archiveConfirmOpen, setArchiveConfirmOpen] = useState(false);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);

  return (
    <>
      <div className={styles.bar}>
        <div className={styles.statusText}>
          <span className={isDirty ? `${styles.dot} ${styles.dotUnsaved}` : styles.dot} />
          {isDirty ? "Unsaved changes" : "All changes saved"}
        </div>
        <div className={styles.actions}>
          {isExisting && (
            <button className={styles.deleteButton} onClick={() => setDeleteConfirmOpen(true)}>
              Delete
            </button>
          )}
          {isExisting && (
            <button className={styles.archiveButton} onClick={() => setArchiveConfirmOpen(true)}>
              Archive
            </button>
          )}
          <button className={styles.scheduleButton} onClick={() => setScheduleOpen(true)}>
            Schedule
          </button>
        </div>
      </div>

      <ScheduleModal
        open={scheduleOpen}
        onCancel={() => setScheduleOpen(false)}
        onConfirm={(dateTime) => {
          onSchedule(dateTime);
          setScheduleOpen(false);
        }}
      />
      <ConfirmModal
        open={archiveConfirmOpen}
        title="Archive this article?"
        message="It will be removed from the public listing but its data is preserved."
        confirmLabel="Confirm Archive"
        danger
        onCancel={() => setArchiveConfirmOpen(false)}
        onConfirm={() => {
          onArchive();
          setArchiveConfirmOpen(false);
        }}
      />
      <ConfirmModal
        open={deleteConfirmOpen}
        title="Delete this article?"
        message="This action cannot be undone."
        confirmLabel="Confirm Delete"
        danger
        onCancel={() => setDeleteConfirmOpen(false)}
        onConfirm={() => {
          onDelete();
          setDeleteConfirmOpen(false);
        }}
      />
    </>
  );
};

export default BlogStickyActionBar;