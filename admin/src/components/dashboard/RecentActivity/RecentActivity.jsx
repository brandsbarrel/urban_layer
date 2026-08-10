import React from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import {
  MdShoppingBag,
  MdPriorityHigh,
  MdPerson,
  MdEdit,
  MdArrowForward,
} from "react-icons/md";
import styles from "./RecentActivity.module.css";

const ICON_MAP = {
  shopping_bag: MdShoppingBag,
  priority_high: MdPriorityHigh,
  person: MdPerson,
  edit: MdEdit,
};

const RecentActivity = () => {
  const activity = useSelector((state) => state.dashboard.recentActivity);

  return (
    <div className={styles.card}>
      <h3 className={styles.title}>Recent Activity</h3>
      <div className={styles.timeline}>
        <div className={styles.timelineLine} />
        {activity.map((item) => {
          const Icon = ICON_MAP[item.icon];
          return (
            <div key={item.id} className={styles.item}>
              <div className={`${styles.dot} ${styles[item.tone]}`}>
                <Icon />
              </div>
              <div className={styles.content}>
                <p
                  className={
                    item.titleTone === "error"
                      ? `${styles.itemTitle} ${styles.itemTitleError}`
                      : styles.itemTitle
                  }
                >
                  {item.title}
                </p>
                <p className={styles.itemDescription}>{item.description}</p>
                <p className={styles.itemTime}>{item.time}</p>
              </div>
            </div>
          );
        })}
      </div>
      <Link to="/activity" className={styles.viewHistory}>
        View History <MdArrowForward />
      </Link>
    </div>
  );
};

export default RecentActivity;