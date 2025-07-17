import axios from "axios";

// Get environment variables with fallbacks for browser compatibility
const getEnvVar = (name, fallback = null) => {
  try {
    return (
      (typeof process !== "undefined" && process.env && process.env[name]) ||
      fallback
    );
  } catch (error) {
    return fallback;
  }
};

const API_BASE_URL = getEnvVar(
  "REACT_APP_API_URL",
  "http://localhost:3000/api/v1",
);
const NODE_ENV = getEnvVar("NODE_ENV", "production");

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true, // Important for JWT cookies
  timeout: 10000, // 10 second timeout
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    // Add auth token if available
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Log request in development
    if (NODE_ENV === "development") {
      console.log(
        `🔄 API Request: ${config.method?.toUpperCase()} ${config.url}`,
        config.data ? { data: config.data } : "",
      );
    }

    return config;
  },
  (error) => {
    console.error("❌ Request error:", error);
    return Promise.reject(error);
  },
);

// Response interceptor
api.interceptors.response.use(
  (response) => {
    // Log successful responses in development
    if (NODE_ENV === "development") {
      console.log(
        `✅ API Response: ${response.status}`,
        response.config.url,
        response.data,
      );
    }

    return response.data;
  },
  (error) => {
    // Log errors in development
    if (NODE_ENV === "development") {
      console.error("❌ API Error:", error);
    }

    let errorMessage = "An unexpected error occurred";
    let shouldFallbackToDemo = false;

    // Network errors - should fallback to demo
    if (error.code === "ERR_NETWORK" || error.code === "ECONNREFUSED") {
      errorMessage = "Backend server is not available. Switching to demo mode.";
      shouldFallbackToDemo = true;
    }
    // Timeout errors - should fallback to demo
    else if (error.code === "ECONNABORTED") {
      errorMessage =
        "Request timeout. Backend server may be slow. Switching to demo mode.";
      shouldFallbackToDemo = true;
    }
    // Server errors (5xx) - should fallback to demo
    else if (error.response?.status >= 500) {
      errorMessage = "Server error occurred. Switching to demo mode.";
      shouldFallbackToDemo = true;
    }
    // Client errors (4xx) - show specific error
    else if (error.response?.data?.message) {
      errorMessage = error.response.data.message;
    } else if (error.message) {
      errorMessage = error.message;
    }

    // Handle unauthorized requests
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");

      // Don't fallback to demo for auth errors unless it's a network issue
      if (!shouldFallbackToDemo) {
        // Redirect to login if not already there
        if (window.location.pathname !== "/login") {
          window.location.href = "/login";
        }
      }
    }

    // Enhanced error object
    const enhancedError = {
      message: errorMessage,
      status: error.response?.status,
      code: error.code,
      shouldFallbackToDemo,
      originalError: error,
      ...error.response?.data,
    };

    return Promise.reject(enhancedError);
  },
);

// Helper function to check if backend is available - simplified version
export const checkBackendHealth = async () => {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3000); // 3 second timeout

    const response = await fetch(`${API_BASE_URL}/health`, {
      method: "GET",
      signal: controller.signal,
      headers: {
        "Content-Type": "application/json",
      },
    });

    clearTimeout(timeoutId);
    return response.ok;
  } catch (error) {
    return false;
  }
};

// Helper function to test API connectivity - no longer calls /health
export const testConnection = async () => {
  try {
    // Instead of calling /health, try a simple GET to the base URL
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3000);

    const response = await fetch(API_BASE_URL, {
      method: "GET",
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    // Even if it returns 404, it means the server is responding
    const connected = response.status < 500;

    return {
      connected,
      message: connected
        ? "Backend connected successfully"
        : "Backend returned server error",
    };
  } catch (error) {
    if (error.name === "AbortError") {
      return {
        connected: false,
        message: "Connection timeout",
        shouldUseDemoMode: true,
      };
    }

    return {
      connected: false,
      message: error.message,
      shouldUseDemoMode: true,
    };
  }
};

// Create a mock health endpoint response for when backend doesn't have it
export const createMockHealthResponse = () => {
  return {
    status: "ok",
    timestamp: new Date().toISOString(),
    uptime: "unknown",
    version: "1.0.0",
  };
};

export default api;
