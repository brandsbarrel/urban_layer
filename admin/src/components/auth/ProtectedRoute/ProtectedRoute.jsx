import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import styles from "./ProtectedRoute.module.css";

const ProtectedRoute = ({ children }) => {
  const location = useLocation();
  const { accessToken, restoreStatus } = useSelector((state) => state.auth);

  if (!accessToken && (restoreStatus === "idle" || restoreStatus === "loading")) {
    return (
      <div className={styles.loadingScreen}>
        <div className={styles.spinner} />
      </div>
    );
  }

  if (!accessToken) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return children;
};

export default ProtectedRoute;
