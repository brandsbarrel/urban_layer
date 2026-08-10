import { createSlice } from "@reduxjs/toolkit";

// Mock admin identity. This will be replaced by real session data
// once the Admin Login page and authentication API are implemented.
const initialState = {
  currentAdmin: {
    name: "Alexander Voss",
    role: "Super Admin",
    avatarUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBgpPcfuIxzvxm6jmhEW-KUKMFJ_xtb3qGK5ZJTS3ibF75SQ5M4FbxYo0pA55vN3JsIqH_izw_S_CX-f0ivY_FaGiWQKzdRSTh50C8VX46WvIY-JREAua7UseOxBZcQrFG9hPIX4-Ys9UtJOWpPKJzDBKYp1_B74JhSNqBmy4wY0r-XfRJLu4fl-X31mKI6OamlhJNVKB3yuKkPccFS_8hG_Q7mckC-rZgJEINBiyqwjOz3lvfliQlUHQICrFWp5COG4Zt-EBS2UaY",
  },
  isAuthenticated: true, // placeholder until real auth flow exists
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout(state) {
      state.isAuthenticated = false;
    },
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;