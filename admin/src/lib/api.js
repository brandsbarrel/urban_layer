const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:4000/api";
const AUTH_TOKEN_STORAGE_KEY = "urban_layers_admin_token";

let accessToken = localStorage.getItem(AUTH_TOKEN_STORAGE_KEY) || "";

const setAccessToken = (token) => {
  accessToken = token || "";

  if (accessToken) {
    localStorage.setItem(AUTH_TOKEN_STORAGE_KEY, accessToken);
  } else {
    localStorage.removeItem(AUTH_TOKEN_STORAGE_KEY);
  }
};

const getAccessToken = () => {
  return accessToken || localStorage.getItem(AUTH_TOKEN_STORAGE_KEY) || "";
};

const apiRequest = async (path, options = {}) => {
  const token = getAccessToken();
  const isFormData = options.body instanceof FormData;
  const headers = {
    ...(isFormData ? {} : { "Content-Type": "application/json" }),
    ...(options.headers || {})
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers
  });

  if (response.status === 204) {
    return null;
  }

  const payload = await response.json();

  if (!response.ok || payload.success === false) {
    throw new Error(payload.message || "API request failed.");
  }

  return payload;
};

export { apiRequest, setAccessToken, getAccessToken, API_BASE_URL, AUTH_TOKEN_STORAGE_KEY };
