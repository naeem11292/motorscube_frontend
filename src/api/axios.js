
import axios from "axios";

const BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000/api/v1";

const TOKEN_KEY = "motorscube_token";

const api = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
});

let refreshPromise = null;
let redirectingToLogin = false;

const isAuthEndpoint = (url = "") =>
  /\/auth\/(login|register|refresh|logout|forgot-password|verify-otp|reset-password)/i.test(
    url
  );

const clearAuthentication = () => {
  localStorage.removeItem(TOKEN_KEY);

  window.dispatchEvent(new Event("auth-changed"));

  if (!redirectingToLogin) {
    redirectingToLogin = true;
    window.location.href = "/login";
  }
};

api.interceptors.request.use(
  (config) => {
    config.withCredentials = true;

    const token = localStorage.getItem(TOKEN_KEY);

    if (token) {
      if (typeof config.headers?.set === "function") {
        config.headers.set("Authorization", `Bearer ${token}`);
      } else {
        config.headers = config.headers || {};
        config.headers.Authorization = `Bearer ${token}`;
      }
    }

    if (typeof FormData !== "undefined" && config.data instanceof FormData) {
      if (typeof config.headers?.delete === "function") {
        config.headers.delete("Content-Type");
      } else if (config.headers) {
        delete config.headers["Content-Type"];
      }
    }

    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (!error.response || !originalRequest) {
      return Promise.reject(error);
    }

    const status = error.response.status;
    const message = String(
      error.response.data?.message || ""
    ).toLowerCase();

    const isExpiredToken =
      message.includes("expired") ||
      error.response.data?.code === "ACCESS_TOKEN_EXPIRED";

    if (
      status !== 401 ||
      !isExpiredToken ||
      originalRequest._retry ||
      isAuthEndpoint(originalRequest.url)
    ) {
      return Promise.reject(error);
    }

    originalRequest._retry = true;

    try {
      if (!refreshPromise) {
        refreshPromise = axios
          .post(
            `${BASE_URL}/auth/refresh`,
            {},
            {
              withCredentials: true,
            }
          )
          .then((response) => {
            const newAccessToken =
              response.data?.data?.access_token ||
              response.data?.access_token;

            if (!newAccessToken) {
              throw new Error("Refresh response did not contain an access token.");
            }

            localStorage.setItem(TOKEN_KEY, newAccessToken);

            window.dispatchEvent(new Event("auth-changed"));

            return newAccessToken;
          })
          .finally(() => {
            refreshPromise = null;
          });
      }

      const newAccessToken = await refreshPromise;

      if (typeof originalRequest.headers?.set === "function") {
        originalRequest.headers.set(
          "Authorization",
          `Bearer ${newAccessToken}`
        );
      } else {
        originalRequest.headers = originalRequest.headers || {};
        originalRequest.headers.Authorization =
          `Bearer ${newAccessToken}`;
      }

      return api(originalRequest);
    } catch (refreshError) {
      const refreshStatus = refreshError.response?.status;

      if (refreshStatus === 401 || refreshStatus === 403) {
        clearAuthentication();
      }

      return Promise.reject(refreshError);
    }
  }
);

export default api;
