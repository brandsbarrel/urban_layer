import React from "react";
import { MdDiamond, MdArrowForward, MdSettingsSuggest, MdEdit, MdDelete } from "react-icons/md";
import styles from "./CampaignCard.module.css";

const STATUS_CLASS = { Active: "statusActive", Scheduled: "statusScheduled", Expired: "statusExpired", Ongoing: "statusOngoing" };

const daysUntil = (dateStr) => {
  const diff = new Date(dateStr).getTime() - Date.now();
  return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
};

const CampaignCard = ({ coupon, onView, onEdit, onDelete }) => {
  if (coupon.heroImage) {
    return (
      <div className={styles.heroCard} onClick={onView}>
        <div className={styles.heroImageWrapper}>
          <img src={coupon.heroImage} alt={coupon.title} />
          <div className={styles.heroOverlay} />
          <div className={styles.heroBottomLeft}>
            <span className={`${styles.statusPill} ${styles[STATUS_CLASS[coupon.status]]}`}>{coupon.status}</span>
            <h3 className={styles.heroTitle}>{coupon.title}</h3>
          </div>
          <div className={styles.heroDiscountBadge}>{coupon.discountValue}% OFF</div>
        </div>
        <div className={styles.heroBody}>
          <div className={styles.heroBodyTop}>
            <p className={styles.typeLabel}>{coupon.type} Campaign</p>
            <p className={styles.revenueText}>${coupon.revenue.toLocaleString()} Revenue</p>
          </div>
          <div>
            <div className={styles.progressLabels}>
              <span>Campaign Progress</span>
              <span className={styles.progressPercent}>{coupon.progressPercent}% Elapsed</span>
            </div>
            <div className={styles.progressTrack}>
              <div className={styles.progressFill} style={{ width: `${coupon.progressPercent}%` }} />
            </div>
          </div>
          <div className={styles.heroFooter}>
            <span className={styles.endsIn}>Ends in {daysUntil(coupon.endDate)} days</span>
            <button className={styles.viewLink}>
              View Details <MdArrowForward />
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (coupon.status === "Scheduled") {
    return (
      <div className={styles.scheduledCard}>
        <div className={styles.scheduledTop}>
          <div>
            <span className={`${styles.statusPill} ${styles[STATUS_CLASS[coupon.status]]}`}>{coupon.status}</span>
            <h3 className={styles.title}>{coupon.title}</h3>
            <p className={styles.subtitle}>{coupon.subtitle}</p>
          </div>
          <div className={styles.iconCircle}>
            <MdDiamond />
          </div>
        </div>
        <div className={styles.countdownArea}>
          <p className={styles.countdownLabel}>Starts in</p>
          <p className={styles.countdownValue}>{daysUntil(coupon.startDate)} days</p>
        </div>
        <div className={styles.scheduledFooter}>
          <span className={styles.offerTag}>{coupon.type.toUpperCase()}</span>
          <div className={styles.iconActions}>
            <button onClick={onEdit} aria-label="Edit">
              <MdEdit />
            </button>
            <button onClick={onDelete} className={styles.deleteIcon} aria-label="Delete">
              <MdDelete />
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.standardCard} onClick={onView}>
      <div className={styles.standardTop}>
        <div>
          <span className={`${styles.statusPill} ${styles.statusOngoing}`}>Ongoing</span>
          <h3 className={styles.title}>{coupon.title}</h3>
          <p className={styles.subtitle}>{coupon.subtitle}</p>
        </div>
        <div className={styles.valueBadge}>
          <span>Value</span>
          {coupon.discountValue}%
        </div>
      </div>
      <div className={styles.statGrid}>
        <div className={styles.statBox}>
          <p className={styles.statLabel}>Redemptions</p>
          <p className={styles.statValue}>{coupon.redemptions.toLocaleString()}</p>
        </div>
        <div className={styles.statBox}>
          <p className={styles.statLabel}>Avg. Basket</p>
          <p className={styles.statValue}>${coupon.avgBasket}</p>
        </div>
      </div>
      <div className={styles.standardFooter}>
        <div className={styles.avatarStack}>
          <div className={styles.avatarDot} />
          <div className={styles.avatarDot} />
          <div className={styles.avatarDot} />
        </div>
        <button
          className={styles.manageLink}
          onClick={(e) => {
            e.stopPropagation();
            onView();
          }}
        >
          Manage Rules <MdSettingsSuggest />
        </button>
      </div>
    </div>
  );
};

export default CampaignCard;