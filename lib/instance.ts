import environment from "@/config/environments";
import axios from "axios";

const headers = {
  "Content-Type": "application/json",
};

const instance = axios.create({
  baseURL: environment.NEXT_PUBLIC_API,
  headers,
  timeout: 60 * 1000,
});

instance.interceptors.request.use(
  (config) => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("token");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error),
);

instance.interceptors.response.use(
  (response) => response,
  (error) => {
    const message =
      error?.response?.data?.message || error?.message || "Terjadi kesalahan";

    error.message = message;

    return Promise.reject(error);
  },
);

export default instance;
