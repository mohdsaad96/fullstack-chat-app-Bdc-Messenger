import axios from "axios";

// In production, use the backend URL from environment variable
// In development, use relative /api path (Vite proxy handles this)
const baseURL = import.meta.env.PROD 
  ? import.meta.env.VITE_BACKEND_URL || "http://localhost:5000"
  : "/api";

export const axiosInstance = axios.create({
  baseURL,
  withCredentials: true,
});
