import axios from "axios";

const publicApi = axios.create({
  baseURL: "https://api.urbanlayersco.com/api",
  headers: {
    "Content-Type": "application/json",
  },
});

export const logPublicApiResult = (label, endpoint, payload) => {
  const items = payload?.data?.items || payload?.items || payload?.data || payload;
  const count = Array.isArray(items) ? items.length : undefined;
  console.log(`[PUBLIC API] ${label}`, {
    endpoint,
    count,
    response: payload,
  });
};

export default publicApi;
