import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import {
  MdDashboard,
  MdInventory2,
  MdCategory,
  MdShoppingCart,
  MdGroup,
  MdLocalOffer,
  MdArticle,
  MdSettings,
  MdAccountCircle,
  MdLogout,
  MdAdd,
  MdClose,
} from "react-icons/md";
import { closeSidebar } from "../../../redux/slices/uiSlice";
import { logout } from "../../../redux/slices/authSlice";
import styles from "./Sidebar.module.css";

const navItems = [
  { to: "/", label: "Dashboard", icon: MdDashboard, end: true },
  { to: "/products", label: "Products", icon: MdInventory2 },
  { to: "/categories", label: "Categories", icon: MdCategory },
  { to: "/orders", label: "Orders", icon: MdShoppingCart },
  { to: "/customers", label: "Customers", icon: MdGroup },
  { to: "/coupons", label: "Coupons & Offers", icon: MdLocalOffer },
  { to: "/blogs", label: "Blogs", icon: MdArticle },
];

const accountLinks = [
  { to: "/settings", label: "Settings", icon: MdSettings },
  { to: "/profile", label: "Profile", icon: MdAccountCircle },
];

const Sidebar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const sidebarOpen = useSelector((state) => state.ui.sidebarOpen);

  const linkClass = ({ isActive }) =>
    isActive ? `${styles.navLink} ${styles.navLinkActive}` : styles.navLink;

  const handleLogout = async () => {
    await dispatch(logout());
    dispatch(closeSidebar());
    navigate("/login", { replace: true });
  };

  return (
    <>
      {sidebarOpen && (
        <div className={styles.overlay} onClick={() => dispatch(closeSidebar())} aria-hidden="true" />
      )}
      <aside className={`${styles.sidebar} ${sidebarOpen ? styles.sidebarOpen : ""}`}>
        <div className={styles.brandRow}>
          <div>
            <h1 className={styles.brandTitle}>Urban Layers Co.</h1>
            <p className={styles.brandSubtitle}>Enterprise Admin</p>
          </div>
          <button
            className={styles.closeButton}
            onClick={() => dispatch(closeSidebar())}
            aria-label="Close menu"
          >
            <MdClose />
          </button>
        </div>

        <nav className={styles.nav}>
          {navItems.map(({ to, label, icon: Icon, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={linkClass}
              onClick={() => dispatch(closeSidebar())}
            >
              <Icon className={styles.navIcon} />
              <span>{label}</span>
            </NavLink>
          ))}

          <div className={styles.accountSection}>
            <p className={styles.accountLabel}>Account</p>
            {accountLinks.map(({ to, label, icon: Icon }) => (
              <NavLink
                key={to}
                to={to}
                className={linkClass}
                onClick={() => dispatch(closeSidebar())}
              >
                <Icon className={styles.navIcon} />
                <span>{label}</span>
              </NavLink>
            ))}
            <button type="button" className={styles.navLink} onClick={handleLogout}>
              <MdLogout className={styles.navIcon} />
              <span>Logout</span>
            </button>
          </div>
        </nav>

        <NavLink to="/products/new" className={styles.quickAddButton}>
          <MdAdd />
          <span>Quick Add</span>
        </NavLink>
      </aside>
    </>
  );
};

export default Sidebar;