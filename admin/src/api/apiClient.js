import { getAccessToken } from "./tokenStore";

const BASE_URL = import.meta.env.VITE_API_BASE_URL || "/api";

class ApiError extends Error {
  constructor(message, status, errors) {
    super(message);
    this.status = status;
    this.errors = errors;
  }
}

const buildUrl = (path, params) => {
  const url = new URL(`${BASE_URL}${path}`, window.location.origin);
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== "") {
        url.searchParams.set(key, value);
      }
    });
  }
  return url.toString();
};

const apiRequest = async (path, { method = "GET", body, params, skipAuth = false } = {}) => {
  const headers = { "Content-Type": "application/json" };
  const token = getAccessToken();

  if (token && !skipAuth) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(buildUrl(path, params), {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined
  });

  if (response.status === 204) {
    return null;
  }

  const payload = await response.json();

  if (!response.ok || !payload?.success) {
    throw new ApiError(payload?.message || "Request failed.", response.status, payload?.errors);
  }

  return payload;
};

export { apiRequest, ApiError };
