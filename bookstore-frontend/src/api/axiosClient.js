import axios from "axios";

const axiosClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: { "Content-Type": "application/json" },
  timeout: 15000,
});

// Runs before EVERY request: adds the JWT token if the user is logged in
axiosClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Runs for EVERY response: if the token is rejected, tell the app to log out
axiosClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;
    const url = error.config?.url || "";
    const hadToken = Boolean(localStorage.getItem("token"));

    // A 401 on the login API only means "wrong password", not "session expired"
    if (status === 401 && hadToken && !url.includes("/api/auth/")) {
      window.dispatchEvent(new Event("auth:unauthorized"));
    }
    return Promise.reject(error);
  }
);

export default axiosClient;