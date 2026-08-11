const TOKEN_KEY = "urban_layers_admin_token";

let accessToken = localStorage.getItem(TOKEN_KEY) || "";

const getAccessToken = () => {
  return accessToken || localStorage.getItem(TOKEN_KEY) || "";
};

const setAccessToken = (token) => {
  accessToken = token || "";

  if (accessToken) {
    localStorage.setItem(TOKEN_KEY, accessToken);
  } else {
    localStorage.removeItem(TOKEN_KEY);
  }
};

const clearAccessToken = () => {
  accessToken = "";
  localStorage.removeItem(TOKEN_KEY);
};

export { getAccessToken, setAccessToken, clearAccessToken, TOKEN_KEY };
