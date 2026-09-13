import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectAuth } from "../../redux/slices/authSlice";

function ProtectedRoute({ children }) {
  const { isAuthenticated, isInitializing, user } = useSelector(selectAuth);
  const location = useLocation();

  if (isInitializing) {
    return (
      <div
        role="status"
        style={{ minHeight: '100vh', display: 'grid', placeItems: 'center', color: '#4c4546' }}
      >
        Checking your account...
      </div>
    );
  }

  if (!isAuthenticated || user?.isGuest) {
    return (
      <Navigate
        to="/login"
        replace
        state={{ from: location }}
      />
    );
  }

  return children || <Outlet />;
}

export default ProtectedRoute;
