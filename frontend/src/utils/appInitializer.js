import { testConnection } from "../services/api";
import { authService } from "../services/authService";

// Initialize app and check backend connectivity
export const initializeApp = async () => {
  console.log("🚀 Initializing BidDaddy application...");

  try {
    // Test backend connectivity
    const connectionTest = await testConnection();

    if (connectionTest.connected) {
      console.log("✅ Backend connected successfully");

      // Clear any demo mode flags if backend is available
      if (localStorage.getItem("useDemoMode") === "true") {
        localStorage.removeItem("useDemoMode");
        console.log("📡 Backend available, switching from demo mode");
      }

      return {
        success: true,
        mode: "live",
        message: "Connected to live backend",
      };
    } else {
      console.warn("⚠️ Backend not available:", connectionTest.message);

      // Enable demo mode
      if (connectionTest.shouldUseDemoMode) {
        localStorage.setItem("useDemoMode", "true");
        console.log("🎭 Enabling demo mode");
      }

      return {
        success: true,
        mode: "demo",
        message: "Using demo mode - backend not available",
      };
    }
  } catch (error) {
    console.error("❌ App initialization error:", error);

    // Fallback to demo mode
    localStorage.setItem("useDemoMode", "true");

    return {
      success: true,
      mode: "demo",
      message: "Using demo mode due to initialization error",
    };
  }
};

// Check if user should be auto-logged in
export const checkAutoLogin = async () => {
  try {
    const token = localStorage.getItem("token");
    const demoUser = localStorage.getItem("demoUser");

    if (token || demoUser) {
      console.log("🔐 Checking existing authentication...");

      // Verify token/session is still valid
      const profile = await authService.getProfile();

      if (profile && profile.user) {
        console.log("✅ User authenticated:", profile.user.userName);
        return {
          authenticated: true,
          user: profile.user,
        };
      }
    }

    return { authenticated: false };
  } catch (error) {
    console.warn("⚠️ Auto-login check failed:", error.message);

    // Clear invalid tokens
    localStorage.removeItem("token");
    localStorage.removeItem("demoUser");

    return { authenticated: false };
  }
};

// Get app configuration
export const getAppConfig = () => {
  const isDemoMode = authService.isDemoMode();
  const isOnline = navigator.onLine;

  return {
    isDemoMode,
    isOnline,
    backendUrl: process.env.REACT_APP_API_URL || "http://localhost:3000/api/v1",
    version: process.env.REACT_APP_VERSION || "1.0.0",
    environment: process.env.NODE_ENV || "development",
  };
};

// Monitor connection status
export const setupConnectionMonitoring = (onStatusChange) => {
  const handleOnline = () => {
    console.log("🌐 Connection restored");
    onStatusChange({ online: true });
  };

  const handleOffline = () => {
    console.log("📴 Connection lost, enabling demo mode");
    localStorage.setItem("useDemoMode", "true");
    onStatusChange({ online: false });
  };

  window.addEventListener("online", handleOnline);
  window.addEventListener("offline", handleOffline);

  // Return cleanup function
  return () => {
    window.removeEventListener("online", handleOnline);
    window.removeEventListener("offline", handleOffline);
  };
};
