import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { MdMenu, MdSearch, MdNotifications, MdMail, MdLanguage, MdDarkMode, MdLogout } from "react-icons/md";
import { toggleSidebar, toggleDarkMode, setSearchQuery } from "../../../redux/slices/uiSlice";
import { logout } from "../../../redux/slices/authSlice";
import styles from "./Header.module.css";

const Header = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const searchQuery = useSelector((state) => state.ui.searchQuery);
  const darkMode = useSelector((state) => state.ui.darkMode);
  const admin = useSelector((state) => state.auth.admin);

  const handleLogout = async () => {
    await dispatch(logout());
    navigate("/login", { replace: true });
  };

  return (
    <header className={styles.header}>
      <div className={styles.leftGroup}>
        <button className={styles.menuButton} aria-label="Open menu" onClick={() => dispatch(toggleSidebar())}>
          <MdMenu />
        </button>
        <div className={styles.searchWrapper}>
          <MdSearch className={styles.searchIcon} />
          <input
            className={styles.searchInput}
            type="text"
            placeholder="Search orders, products, analytics..."
            value={searchQuery}
            onChange={(e) => dispatch(setSearchQuery(e.target.value))}
          />
        </div>
      </div>

      <div className={styles.rightGroup}>
        <div className={styles.iconGroup}>
          <button className={styles.iconButton} title="Coming Soon" aria-label="Notifications (Coming Soon)">
            <MdNotifications />
          </button>
          <button className={styles.iconButton} title="Coming Soon" aria-label="Messages (Coming Soon)">
            <MdMail />
          </button>
          <button className={styles.iconButton} title="Coming Soon" aria-label="Language (Coming Soon)">
            <MdLanguage />
          </button>
          <button
            className={styles.iconButton}
            aria-label="Toggle dark mode"
            aria-pressed={darkMode}
            onClick={() => dispatch(toggleDarkMode())}
          >
            <MdDarkMode />
          </button>
        </div>

        <div className={styles.divider} />

        <Link to="/profile" className={styles.profileLink}>
          <div className={styles.profileText}>
            <p className={styles.profileName}>{admin?.name || "Admin"}</p>
            <p className={styles.profileRole}>{admin?.role || ""}</p>
          </div>
          <div className={styles.avatarWrapper}>
            {admin?.avatarUrl ? (
              <img src={admin.avatarUrl} alt={`${admin.name} avatar`} className={styles.avatarImage} />
            ) : (
              <div className={styles.avatarFallback}>{(admin?.name || "A").charAt(0)}</div>
            )}
          </div>
        </Link>

        <button className={styles.iconButton} title="Log out" aria-label="Log out" onClick={handleLogout}>
          <MdLogout />
        </button>
      </div>
    </header>
  );
};

export default Header;