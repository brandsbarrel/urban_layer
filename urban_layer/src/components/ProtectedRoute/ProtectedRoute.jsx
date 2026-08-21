import { Navigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectAuth } from "../../redux/slices/authSlice";

function ProtectedRoute({ children }) {
  const { isAuthenticated, user } = useSelector(selectAuth);
  const location = useLocation();

  if (!isAuthenticated || user?.isGuest) {
    return (
      <Navigate
        to="/login"
        replace
        state={{ from: location }}
      />
    );
  }

  return children;
}

export default ProtectedRoute;