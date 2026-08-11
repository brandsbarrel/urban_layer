import React, { useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Sidebar from "./components/layout/Sidebar/Sidebar";
import Header from "./components/layout/Header/Header";
import Footer from "./components/layout/Footer/Footer";
import Dashboard from "./pages/Dashboard/Dashboard";
import Products from "./pages/Products/Products";
import ProductForm from "./pages/ProductForm/ProductForm";
import Categories from "./pages/Categories/Categories";
import Orders from "./pages/Orders/Orders";
import Customers from "./pages/Customers/Customers";
import Coupons from "./pages/Coupons/Coupons";
import Blogs from "./pages/Blogs/Blogs";
import BlogForm from "./pages/BlogForm/BlogForm";
import Login from "./pages/Login/Login";
import ComingSoon from "./components/common/ComingSoon/ComingSoon";
import ProtectedRoute from "./components/auth/ProtectedRoute/ProtectedRoute";
import { restoreSession } from "./redux/slices/authSlice";
import styles from "./App.module.css";

const AdminLayout = ({ children }) => (
  <div className={styles.appShell}>
    <Sidebar />
    <div className={styles.mainColumn}>
      <Header />
      <div className={styles.pageContent}>{children}</div>
      <Footer />
    </div>
  </div>
);

const App = () => {
  const dispatch = useDispatch();
  const restoreStatus = useSelector((state) => state.auth.restoreStatus);

  useEffect(() => {
    if (restoreStatus === "idle") {
      dispatch(restoreSession());
    }
  }, [restoreStatus, dispatch]);

  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route
        path="/*"
        element={
          <ProtectedRoute>
            <AdminLayout>
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/products" element={<Products />} />
                <Route path="/products/new" element={<ProductForm />} />
                <Route path="/products/edit/:id" element={<ProductForm />} />
                <Route path="/categories" element={<Categories />} />
                <Route
                  path="/categories/edit/:id"
                  element={<ComingSoon featureName="Edit Category" />}
                />
                <Route path="/orders" element={<Orders />} />
                <Route path="/orders/new" element={<ComingSoon featureName="Create Order" />} />
                <Route path="/customers" element={<Customers />} />
                <Route
                  path="/customers/new"
                  element={<ComingSoon featureName="Add Customer" />}
                />
                <Route path="/coupons" element={<Coupons />} />
                {/* Blogs intentionally left on mock data — not wired to the API yet */}
                <Route path="/blogs" element={<Blogs />} />
                <Route path="/blogs/new" element={<BlogForm />} />
                <Route path="/blogs/edit/:id" element={<BlogForm />} />
                <Route path="/settings" element={<ComingSoon featureName="Settings" />} />
                <Route path="/profile" element={<ComingSoon featureName="Profile" />} />
                <Route path="/activity" element={<ComingSoon featureName="Activity Log" />} />
              </Routes>
            </AdminLayout>
          </ProtectedRoute>
        }
      />
    </Routes>
  );
};

export default App;