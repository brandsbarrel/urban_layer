import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { loginSuccess, logout } from "../../redux/slices/authSlice";
import { fetchCart } from "../../redux/slices/cartSlice";
import { fetchAddresses } from "../../redux/slices/addressesSlice";
import { getProfile } from "../../services/authService";

function AuthInitializer({ children }) {
  const dispatch = useDispatch();

  useEffect(() => {
    const initialize = async () => {
      const token = localStorage.getItem("customerAccessToken");

      if (!token) return;

      try {
        const profile = await getProfile();

        dispatch(loginSuccess(profile));
        dispatch(fetchCart());
        dispatch(fetchAddresses());
      } catch (error) {
        localStorage.removeItem("customerAccessToken");
        dispatch(logout());
      }
    };

    initialize();
  }, [dispatch]);

  return children;
}

export default AuthInitializer;
