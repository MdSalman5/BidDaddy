import axios from "axios";

const API_BASE_URL = "http://localhost:3000/api/v1";

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true, // Important for JWT cookies
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

// Response interceptor
api.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (error) => {
    const errorMessage =
      error.response?.data?.message ||
      error.message ||
      "An unexpected error occurred";

    // Handle unauthorized requests
    if (error.response?.status === 401) {
      // Optional: Redirect to login or clear user data
      localStorage.removeItem("user");
    }

    return Promise.reject({
      message: errorMessage,
      status: error.response?.status,
      ...error.response?.data,
    });
  },
);

export default api;
