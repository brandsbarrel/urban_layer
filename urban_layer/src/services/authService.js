import api from "./api";

/* ---------------- LOGIN ---------------- */

export const loginUser = async ({ email, password }) => {
  try {
    const response = await api.post("/customer/auth/login", {
      email,
      password,
    });

    const { accessToken, customer } = response.data.data;

    localStorage.setItem("customerAccessToken", accessToken);

    return customer;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Login failed.",
      {
        cause: error,
      }
    );
  }
};

/* ---------------- REGISTER ---------------- */

export const registerUser = async ({ name, email, password }) => {
  try {
    const response = await api.post("/customer/auth/register", {
      name,
      email,
      password,
    });

    return response.data.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Registration failed.",
      {
        cause: error,
      }
    );
  }
};

/* ---------------- PROFILE ---------------- */

export const getProfile = async () => {
  try {
    const response = await api.get("/customer/profile");

    return response.data.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Unable to fetch profile.",
      {
        cause: error,
      }
    );
  }
};

/* ---------------- UPDATE PROFILE ---------------- */

export const updateProfile = async (profile) => {
  try {
    const response = await api.patch("/customer/profile", profile);

    return response.data.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Unable to update profile.",
      {
        cause: error,
      }
    );
  }
};

/* ---------------- LOGOUT ---------------- */

export const logoutUser = async () => {
  try {
    await api.post("/customer/auth/logout");
  } finally {
    localStorage.removeItem("customerAccessToken");
  }
};

/* ---------------- TOKEN ---------------- */

export const isAuthenticated = () => {
  return Boolean(localStorage.getItem("customerAccessToken"));
};


export const sendPasswordResetLink = async (email) => {
  throw new Error("Forgot Password API is not implemented yet.");
};

/* ---------------- RESET PASSWORD ---------------- */

export const resetPassword = async (data) => {
  throw new Error("Reset Password API is not implemented yet.");
};