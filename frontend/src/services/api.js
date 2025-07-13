import axios from "axios";

const API_BASE_URL = "http://localhost:3000/api/v1";

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true, // Important for JWT cookies
  timeout: 10000, // 10 second timeout
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    console.log(
      `Making API request: ${config.method?.toUpperCase()} ${config.url}`,
    );
    return config;
  },
  (error) => {
    console.error("Request error:", error);
    return Promise.reject(error);
  },
);

// Response interceptor
api.interceptors.response.use(
  (response) => {
    console.log(`API response:`, response.status, response.data);
    return response.data;
  },
  (error) => {
    console.error("API Error:", error);

    let errorMessage = "An unexpected error occurred";

    if (error.code === "ERR_NETWORK") {
      errorMessage =
        "Unable to connect to server. Please check if the backend is running.";
    } else if (error.code === "ECONNREFUSED") {
      errorMessage = "Connection refused. Backend server may not be running.";
    } else if (error.response?.data?.message) {
      errorMessage = error.response.data.message;
    } else if (error.message) {
      errorMessage = error.message;
    }

    // Handle unauthorized requests
    if (error.response?.status === 401) {
      localStorage.removeItem("user");
    }

    return Promise.reject({
      message: errorMessage,
      status: error.response?.status,
      code: error.code,
      ...error.response?.data,
    });
  },
);

export default api;
