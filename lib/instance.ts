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
    const status = error?.response?.status;
    const responseData = error?.response?.data;
    let formattedMessage = "Terjadi kesalahan pada sistem.";

    // 1. Penanganan batas waktu (Timeout) & kegagalan koneksi jaringan (Network Error)
    if (error.code === "ECONNABORTED" || error.message?.includes("timeout")) {
      formattedMessage =
        "Waktu permintaan habis (Request Timeout). Periksa koneksi internet Anda.";
    } else if (!error.response || error.code === "ERR_NETWORK") {
      formattedMessage =
        "Tidak dapat terhubung ke server MARMA (Network Error). Pastikan backend aktif dan jaringan stabil.";
    } else {
      // 2. Penanganan spesifik berdasarkan HTTP Status Code
      switch (status) {
        case 400:
          formattedMessage =
            responseData?.message || "Permintaan tidak valid (Bad Request).";
          break;

        case 401:
          if (typeof window !== "undefined") {
            localStorage.removeItem("token");
            localStorage.removeItem("user");
            if (!window.location.pathname.startsWith("/auth/")) {
              window.location.href = "/auth/login";
            }
          }
          formattedMessage =
            responseData?.message ||
            "Sesi login telah berakhir. Silakan masuk kembali.";
          break;

        case 403:
          formattedMessage =
            responseData?.message ||
            "Akses ditolak. Anda tidak memiliki izin untuk melakukan tindakan ini.";
          break;

        case 404:
          formattedMessage =
            responseData?.message ||
            "Data atau endpoint tidak ditemukan di server (404 Not Found).";
          break;

        case 405:
          formattedMessage =
            responseData?.message ||
            "Metode HTTP permintaan tidak diizinkan oleh server (405 Method Not Allowed).";
          break;

        case 422:
          // Ekstrak pesan validasi pertama dari dictionary `errors` Laravel
          if (responseData?.errors && typeof responseData.errors === "object") {
            const firstKey = Object.keys(responseData.errors)[0];
            const firstVal = responseData.errors[firstKey];
            if (Array.isArray(firstVal) && firstVal.length > 0) {
              formattedMessage = firstVal[0];
            } else if (typeof firstVal === "string") {
              formattedMessage = firstVal;
            } else {
              formattedMessage = responseData.message || "Validasi data gagal.";
            }
          } else {
            formattedMessage =
              responseData?.message ||
              "Validasi data gagal (422 Unprocessable Entity).";
          }
          break;

        case 429:
          formattedMessage =
            responseData?.message ||
            "Terlalu banyak permintaan (Too Many Requests). Mohon tunggu beberapa saat sebelum mencoba kembali.";
          break;

        case 500:
          formattedMessage =
            responseData?.message ||
            "Terjadi kesalahan internal pada server MARMA (500 Internal Server Error). Mohon coba lagi beberapa saat lagi.";
          break;

        case 502:
        case 503:
        case 504:
          formattedMessage =
            "Layanan server backend sedang tidak tersedia atau dalam pemeliharaan (Gateway Error).";
          break;

        default:
          formattedMessage =
            responseData?.message ||
            error?.message ||
            "Terjadi kesalahan saat memproses permintaan.";
          break;
      }
    }

    error.message = formattedMessage;

    return Promise.reject(error);
  },
);

export default instance;
