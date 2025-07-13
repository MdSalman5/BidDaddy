import api from "./api";
import { demoAuthService } from "./demoAuthService";

const isDemoMode = () => {
  return localStorage.getItem("useDemoMode") === "true" || !navigator.onLine;
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

      // Add profile image
      if (userData.profileImage) {
        formData.append("profileImage", userData.profileImage);
      }

      const response = await api.post("/user/register", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      return response;
    } catch (error) {
      // Fallback to demo mode on network error
      if (error.code === "ERR_NETWORK" || error.code === "ECONNREFUSED") {
        localStorage.setItem("useDemoMode", "true");
        return demoAuthService.register(userData);
      }
      throw error;
    }
  },

  // Login user
  login: async (email, password) => {
    if (isDemoMode()) {
      return demoAuthService.login(email, password);
    }

    try {
      const response = await api.post("/user/login", { email, password });
      return response;
    } catch (error) {
      // Fallback to demo mode on network error
      if (error.code === "ERR_NETWORK" || error.code === "ECONNREFUSED") {
        localStorage.setItem("useDemoMode", "true");
        return demoAuthService.login(email, password);
      }
      throw error;
    }
  },

  // Get current user profile
  getProfile: async () => {
    if (isDemoMode()) {
      return demoAuthService.getProfile();
    }

    try {
      const response = await api.get("/user/me");
      return response;
    } catch (error) {
      // Fallback to demo mode on network error
      if (error.code === "ERR_NETWORK" || error.code === "ECONNREFUSED") {
        localStorage.setItem("useDemoMode", "true");
        return demoAuthService.getProfile();
      }
      throw error;
    }
  },

  // Logout user
  logout: async () => {
    if (isDemoMode()) {
      return demoAuthService.logout();
    }

    try {
      const response = await api.get("/user/logout");
      return response;
    } catch (error) {
      // Even on error, logout locally
      localStorage.removeItem("demoUser");
      return { success: true, message: "Logged out locally" };
    }
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
      // Fallback to demo mode on network error
      if (error.code === "ERR_NETWORK" || error.code === "ECONNREFUSED") {
        localStorage.setItem("useDemoMode", "true");
        return demoAuthService.getLeaderboard();
      }
      throw error;
    }
  },

  // Toggle demo mode
  toggleDemoMode: (enabled) => {
    if (enabled) {
      localStorage.setItem("useDemoMode", "true");
    } else {
      localStorage.removeItem("useDemoMode");
    }
  },

  // Check if in demo mode
  isDemoMode,
};
