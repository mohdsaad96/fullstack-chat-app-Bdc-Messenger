import axios from "axios";

// In production, use the backend URL from environment variable
// In development, use relative /api path (Vite proxy handles this)
const backendURL = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";
const baseURL = import.meta.env.PROD 
  ? `${backendURL}/api`
  : "/api";

console.log("Axios Config:");
console.log("- ENV:", import.meta.env.MODE);
console.log("- VITE_BACKEND_URL:", import.meta.env.VITE_BACKEND_URL);
console.log("- Backend URL:", backendURL);
console.log("- API Base URL:", baseURL);

export const axiosInstance = axios.create({
  baseURL,
  withCredentials: true,
});

// Add request interceptor to include token from localStorage (fallback for mobile)
axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  console.log("API Request:", config.url, "Full URL:", config.baseURL + config.url);
  return config;
}, (error) => {
  console.error("Request error:", error);
  return Promise.reject(error);
});

// Add response interceptor for debugging
axiosInstance.interceptors.response.use(
  (response) => {
    console.log("API Response:", response.status, response.config.url);
    return response;
  },
  (error) => {
    console.error("API Error:", {
      message: error.message,
      code: error.code,
      status: error.response?.status,
      url: error.config?.url,
      fullURL: error.config?.baseURL + error.config?.url,
    });
    return Promise.reject(error);
  }
);
