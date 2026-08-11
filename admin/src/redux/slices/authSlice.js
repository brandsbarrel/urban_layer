import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { apiRequest, getAccessToken, setAccessToken } from "../../lib/api";

const ADMIN_STORAGE_KEY = "urban_layers_admin";

const fallbackAdmin = {
  name: "Alexander Voss",
  role: "SuperAdmin",
  avatarUrl:
    "https://lh3.googleusercontent.com/aida-public/AB6AXuBgpPcfuIxzvxm6jmhEW-KUKMFJ_xtb3qGK5ZJTS3ibF75SQ5M4FbxYo0pA55vN3JsIqH_izw_S_CX-f0ivY_FaGiWQKzdRSTh50C8VX46WvIY-JREAua7UseOxBZcQrFG9hPIX4-Ys9UtJOWpPKJzDBKYp1_B74JhSNqBmy4wY0r-XfRJLu4fl-X31mKI6OamlhJNVKB3yuKkPccFS_8hG_Q7mckC-rZgJEINBiyqwjOz3lvfliQlUHQICrFWp5COG4Zt-EBS2UaY"
};

const readStoredAdmin = () => {
  try {
    const storedAdmin = localStorage.getItem(ADMIN_STORAGE_KEY);
    return storedAdmin ? JSON.parse(storedAdmin) : fallbackAdmin;
  } catch {
    localStorage.removeItem(ADMIN_STORAGE_KEY);
    return fallbackAdmin;
  }
};

const initialAccessToken = getAccessToken();

const login = createAsyncThunk("auth/login", async ({ email, password }) => {
  const response = await apiRequest("/admin/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password })
  });

  setAccessToken(response.data.accessToken);
  localStorage.setItem(ADMIN_STORAGE_KEY, JSON.stringify(response.data.admin));

  return {
    accessToken: response.data.accessToken,
    admin: response.data.admin,
    authenticated: true
  };
});

const restoreSession = createAsyncThunk("auth/restoreSession", async () => {
  const storedToken = getAccessToken();
  const storedAdmin = localStorage.getItem(ADMIN_STORAGE_KEY);

  if (!storedToken) {
    setAccessToken("");
    localStorage.removeItem(ADMIN_STORAGE_KEY);

    return {
      accessToken: "",
      admin: fallbackAdmin,
      authenticated: false
    };
  }

  setAccessToken(storedToken);

  return {
    accessToken: storedToken,
    admin: storedAdmin ? readStoredAdmin() : fallbackAdmin,
    authenticated: true
  };
});

const logoutSession = createAsyncThunk("auth/logoutSession", async () => {
  try {
    await apiRequest("/admin/auth/logout", { method: "POST" });
  } catch {
    // no-op for local placeholder mode
  }

  setAccessToken("");
  localStorage.removeItem(ADMIN_STORAGE_KEY);
});

const bootstrapSession = restoreSession;
const logout = logoutSession;

const initialState = {
  currentAdmin: initialAccessToken ? readStoredAdmin() : fallbackAdmin,
  accessToken: initialAccessToken,
  isAuthenticated: Boolean(initialAccessToken),
  ready: Boolean(initialAccessToken),
  error: null,
  loginStatus: "idle",
  restoreStatus: initialAccessToken ? "succeeded" : "idle"
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.loginStatus = "loading";
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.ready = true;
        state.isAuthenticated = true;
        state.accessToken = action.payload.accessToken;
        state.currentAdmin = action.payload.admin;
        state.error = null;
        state.loginStatus = "succeeded";
      })
      .addCase(login.rejected, (state, action) => {
        setAccessToken("");
        state.ready = true;
        state.isAuthenticated = false;
        state.accessToken = "";
        state.error = action.error.message || "Login failed.";
        state.loginStatus = "failed";
        localStorage.removeItem(ADMIN_STORAGE_KEY);
      })
      .addCase(restoreSession.pending, (state) => {
        state.restoreStatus = "loading";
      })
      .addCase(restoreSession.fulfilled, (state, action) => {
        state.ready = true;
        state.isAuthenticated = action.payload.authenticated;
        state.accessToken = action.payload.accessToken;
        state.currentAdmin = action.payload.admin;
        state.error = null;
        state.restoreStatus = "succeeded";
      })
      .addCase(restoreSession.rejected, (state, action) => {
        state.ready = true;
        state.isAuthenticated = false;
        state.accessToken = "";
        state.currentAdmin = fallbackAdmin;
        state.error = action.payload || action.error.message || "Failed to restore admin session.";
        state.restoreStatus = "failed";
        localStorage.removeItem(ADMIN_STORAGE_KEY);
      })
      .addCase(logoutSession.fulfilled, (state) => {
        state.isAuthenticated = false;
        state.accessToken = "";
        state.currentAdmin = fallbackAdmin;
        state.loginStatus = "idle";
        state.restoreStatus = "idle";
      });
  }
});

export { login, bootstrapSession, restoreSession, logoutSession, logout };
export default authSlice.reducer;
