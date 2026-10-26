
import axios from "axios";

const BASE_URL =
  import.meta.env.VITE_API_URL ||
  "http://localhost:5000/api/v1";

const axiosInstance = axios.create({
  baseURL: BASE_URL,
});

axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("motorscube_token");

    // Temporary authentication diagnostics
    console.log("API REQUEST:", config.method?.toUpperCase(), config.url);
    console.log("API TOKEN EXISTS:", Boolean(token));
    console.log("API TOKEN LENGTH:", token?.length || 0);

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    } else {
      delete config.headers.Authorization;
    }

    // Let the browser set the multipart boundary for FormData.
    if (config.data instanceof FormData) {
      delete config.headers["Content-Type"];
    }

    return config;
  },
  (error) => Promise.reject(error)
);

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("API ERROR STATUS:", error.response?.status);
    console.error("API ERROR MESSAGE:", error.response?.data);
    console.error("API ERROR URL:", error.config?.url);

    return Promise.reject(error);
  }
);

export default axiosInstance;
