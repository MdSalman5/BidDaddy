import api from "./api";
import { demoAuthService } from "./demoAuthService";

const isDemoMode = () => {
  return localStorage.getItem("useDemoMode") === "true" || 
         localStorage.getItem("demoUser") !== null ||
         !navigator.onLine;
};

const handleApiError = (error, fallbackAction) => {
  // Network errors or server unavailable
  if (
    error.code === "ERR_NETWORK" || 
    error.code === "ECONNREFUSED" ||
    !navigator.onLine ||
    error.response?.status >= 500
  ) {
    console.warn("Backend unavailable, falling back to demo mode");
    localStorage.setItem("useDemoMode", "true");
    return fallbackAction();
  }
  
  // Client errors (400-499) should be thrown as is
  throw error;
};

export const authService = {
  // Register new user
  register: async (userData) => {
    if (isDemoMode()) {
      return demoAuthService.register(userData);
    }

    try {
      const formData = new FormData();

      // Add text fields
      Object.keys(userData).forEach((key) => {
        if (key !== "profileImage" && userData[key] !== undefined) {
          if (typeof userData[key] === "object") {
            formData.append(key, JSON.stringify(userData[key]));
          } else {
            formData.append(key, userData[key]);
          }
        }
      });

      // Add profile image if provided
      if (userData.profileImage) {
        formData.append("profileImage", userData.profileImage);
      }

      const response = await api.post("/user/register", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      // Store token if received
      if (response.token) {
        localStorage.setItem("token", response.token);
      }

      return response;
    } catch (error) {
      return handleApiError(error, () => demoAuthService.register(userData));
    }
  },

  // Login user
  login: async (email, password) => {
    if (isDemoMode()) {
      return demoAuthService.login(email, password);
    }

    try {
      const response = await api.post("/user/login", { email, password });
      
      // Store token if received
      if (response.token) {
        localStorage.setItem("token", response.token);
      }
      
      return response;
    } catch (error) {
      return handleApiError(error, () => demoAuthService.login(email, password));
    }
  },

  // Get current user profile - FIXED to prevent loops
  getProfile: async () => {
    if (isDemoMode()) {
      return demoAuthService.getProfile();
    }

    // Check if we have a token first
    const token = localStorage.getItem("token");
    if (!token) {
      // No token = not authenticated, don't call API
      throw new Error("No authentication token found");
    }

    try {
      const response = await api.get("/user/me");
      return response;
    } catch (error) {
      // If token is invalid, clear it and don't retry
      if (error.response?.status === 401) {
        localStorage.removeItem("token");
        throw new Error("Authentication token invalid");
      }
      
      return handleApiError(error, () => demoAuthService.getProfile());
    }
  },

  // Logout user
  logout: async () => {
    if (isDemoMode()) {
      localStorage.removeItem("demoUser");
      localStorage.removeItem("useDemoMode");
      return demoAuthService.logout();
    }

    try {
      await api.post("/user/logout");
    } catch (error) {
      console.warn("Logout API call failed, continuing with local logout");
    } finally {
      // Always clear local storage
      localStorage.removeItem("token");
      localStorage.removeItem("demoUser");
      localStorage.removeItem("useDemoMode");
    }

    return { success: true, message: "Logged out successfully" };
  },

  // Get leaderboard
  getLeaderboard: async () => {
    if (isDemoMode()) {
      return demoAuthService.getLeaderboard();
    }

    try {
      const response = await api.get("/user/leaderboard");
      return response;
    } catch (error) {
      return handleApiError(error, () => demoAuthService.getLeaderboard());
    }
  },

  // Update user profile
  updateProfile: async (userData) => {
    if (isDemoMode()) {
      return demoAuthService.updateProfile(userData);
    }

    try {
      const response = await api.put("/user/profile", userData);
      return response;
    } catch (error) {
      return handleApiError(error, () => demoAuthService.updateProfile(userData));
    }
  },

  // Change password
  changePassword: async (currentPassword, newPassword) => {
    if (isDemoMode()) {
      return demoAuthService.changePassword(currentPassword, newPassword);
    }

    try {
      const response = await api.put("/user/change-password", {
        currentPassword,
        newPassword,
      });
      return response;
    } catch (error) {
      return handleApiError(error, () => 
        demoAuthService.changePassword(currentPassword, newPassword)
      );
    }
  },

  // Toggle demo mode
  toggleDemoMode: (enabled) => {
    if (enabled) {
      localStorage.setItem("useDemoMode", "true");
    } else {
      localStorage.removeItem("useDemoMode");
      localStorage.removeItem("demoUser");
    }
    
    // Reload page to reinitialize with new mode
    window.location.reload();
  },

  // Check if in demo mode
  isDemoMode,

  // Check if user is authenticated - SIMPLIFIED
  isAuthenticated: () => {
    return Boolean(
      localStorage.getItem("token") || 
      localStorage.getItem("demoUser")
    );
  },

  // Get stored token
  getToken: () => {
    return localStorage.getItem("token");
  },
};
