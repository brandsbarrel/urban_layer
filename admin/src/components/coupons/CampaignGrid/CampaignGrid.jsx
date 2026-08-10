import React from "react";
import { useSelector, useDispatch } from "react-redux";
import CampaignCard from "../CampaignCard/CampaignCard";
import ConfirmModal from "../../common/ConfirmModal/ConfirmModal";
import {
  openDetailsDrawer,
  openEditDrawer,
  setDeleteTarget,
  confirmDelete,
} from "../../../redux/slices/couponsSlice";
import styles from "./CampaignGrid.module.css";

const CampaignGrid = () => {
  const dispatch = useDispatch();
  const { items, searchQuery, statusFilter, typeFilter, deleteTargetId } = useSelector(
    (state) => state.coupons
  );

  const query = searchQuery.trim().toLowerCase();
  const filtered = items.filter((c) => {
    const matchesQuery = !query || c.title.toLowerCase().includes(query) || c.code.toLowerCase().includes(query);
    const matchesStatus = statusFilter === "All" || c.status === statusFilter;
    const matchesType = typeFilter === "All" || c.type === typeFilter;
    return matchesQuery && matchesStatus && matchesType;
  });

  const target = items.find((c) => c.id === deleteTargetId);

  return (
    <div className={styles.grid}>
      {filtered.map((coupon) => (
        <CampaignCard
          key={coupon.id}
          coupon={coupon}
          onView={() => dispatch(openDetailsDrawer(coupon.id))}
          onEdit={() => dispatch(openEditDrawer(coupon.id))}
          onDelete={() => dispatch(setDeleteTarget(coupon.id))}
        />
      ))}
      {filtered.length === 0 && (
        <p className={styles.empty}>No campaigns match your filters.</p>
      )}

      <ConfirmModal
        open={Boolean(target)}
        title="Delete this campaign?"
        message={`"${target?.title}" will be permanently removed. This action cannot be undone.`}
        confirmLabel="Confirm Delete"
        danger
        onCancel={() => dispatch(setDeleteTarget(null))}
        onConfirm={() => dispatch(confirmDelete())}
      />
    </div>
  );
};

export default CampaignGrid;