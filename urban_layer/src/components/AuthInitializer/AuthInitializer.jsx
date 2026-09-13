import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { authInitializationComplete, loginSuccess, logout } from "../../redux/slices/authSlice";
import { fetchCart } from "../../redux/slices/cartSlice";
import { fetchAddresses } from "../../redux/slices/addressesSlice";
import { getProfile } from "../../services/authService";

function AuthInitializer({ children }) {
  const dispatch = useDispatch();

  useEffect(() => {
    const initialize = async () => {
      const token = localStorage.getItem("customerAccessToken");

      if (!token) {
        dispatch(authInitializationComplete());
        return;
      }

      try {
        const profile = await getProfile();

        dispatch(loginSuccess(profile));
        dispatch(fetchCart());
        dispatch(fetchAddresses());
      } catch {
        localStorage.removeItem("customerAccessToken");
        dispatch(logout());
      } finally {
        dispatch(authInitializationComplete());
      }
    };

    initialize();
  }, [dispatch]);

  return children;
}

export default AuthInitializer;
