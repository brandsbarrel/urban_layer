import { apiRequest } from "./apiClient";

export const fetchSettings = async () => {
  const response = await apiRequest("/admin/settings", { method: "GET" });
  return response.data;
};

export const updateSettings = async (settingsData) => {
  const response = await apiRequest("/admin/settings", {
    method: "PUT",
    body: settingsData
  });
  return response.data;
};
