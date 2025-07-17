import { authService } from "../services/authService";

// Safe environment variable getter
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

// Quick backend health check with timeout
const quickHealthCheck = async () => {
  const backendUrl = getEnvVar(
    "REACT_APP_API_URL",
    "http://localhost:3000/api/v1",
  );

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3000); // 3 second timeout

    const response = await fetch(`${backendUrl}/health`, {
      method: "GET",
      signal: controller.signal,
      headers: {
        "Content-Type": "application/json",
      },
    });

    clearTimeout(timeoutId);
    return { connected: response.ok, status: response.status };
  } catch (error) {
    if (error.name === "AbortError") {
      console.warn("⏰ Health check timeout - backend may be slow");
    }
    return { connected: false, error: error.message };
  }
};

// Initialize app and check backend connectivity
export const initializeApp = async () => {
  console.log("🚀 Initializing BidDaddy application...");

  try {
    // Quick health check with timeout
    const healthCheck = await quickHealthCheck();

    if (healthCheck.connected) {
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
      console.warn(
        "⚠️ Backend not available:",
        healthCheck.error || "Health check failed",
      );

      // Enable demo mode
      localStorage.setItem("useDemoMode", "true");
      console.log("🎭 Enabling demo mode");

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

      // Verify token/session is still valid with timeout
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 second timeout

      try {
        const profile = await authService.getProfile();
        clearTimeout(timeoutId);

        if (profile && profile.user) {
          console.log("✅ User authenticated:", profile.user.userName);
          return {
            authenticated: true,
            user: profile.user,
          };
        }
      } catch (profileError) {
        clearTimeout(timeoutId);
        console.warn("⚠️ Profile check failed:", profileError.message);

        // Clear invalid tokens
        localStorage.removeItem("token");
        localStorage.removeItem("demoUser");
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
    backendUrl: getEnvVar("REACT_APP_API_URL", "http://localhost:3000/api/v1"),
    version: getEnvVar("REACT_APP_VERSION", "1.0.0"),
    environment: getEnvVar("NODE_ENV", "production"),
  };
};

// Monitor connection status
export const setupConnectionMonitoring = (onStatusChange) => {
  const handleOnline = () => {
    console.log("🌐 Connection restored");
    // Test backend when connection is restored
    quickHealthCheck().then((result) => {
      if (result.connected) {
        localStorage.removeItem("useDemoMode");
        onStatusChange({ online: true, backendAvailable: true });
      } else {
        localStorage.setItem("useDemoMode", "true");
        onStatusChange({ online: true, backendAvailable: false });
      }
    });
  };

  const handleOffline = () => {
    console.log("📴 Connection lost, enabling demo mode");
    localStorage.setItem("useDemoMode", "true");
    onStatusChange({ online: false, backendAvailable: false });
  };

  window.addEventListener("online", handleOnline);
  window.addEventListener("offline", handleOffline);

  // Return cleanup function
  return () => {
    window.removeEventListener("online", handleOnline);
    window.removeEventListener("offline", handleOffline);
  };
};

// Force refresh backend connection
export const refreshBackendConnection = async () => {
  console.log("🔄 Refreshing backend connection...");

  const result = await quickHealthCheck();

  if (result.connected) {
    localStorage.removeItem("useDemoMode");
    return { success: true, mode: "live" };
  } else {
    localStorage.setItem("useDemoMode", "true");
    return { success: true, mode: "demo" };
  }
};
