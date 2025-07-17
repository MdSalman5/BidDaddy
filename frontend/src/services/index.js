// Main API service
export { default as api } from "./api";

// Authentication services
export { authService } from "./authService";
export { demoAuthService } from "./demoAuthService";

// Business logic services
export { auctionService } from "./auctionService";
export { bidService } from "./bidService";
export { userService } from "./userService";
export { dashboardService } from "./dashboardService";

// Utility services
export {
  checkBackendHealth,
  testConnection,
  createMockHealthResponse,
} from "./api";

// Service status check
export const getServiceStatus = async () => {
  const { testConnection } = await import("./api");

  try {
    const connectionTest = await testConnection();

    return {
      backendConnected: connectionTest.connected,
      demoMode: localStorage.getItem("useDemoMode") === "true",
      online: navigator.onLine,
      timestamp: new Date().toISOString(),
      message: connectionTest.message,
    };
  } catch (error) {
    return {
      backendConnected: false,
      demoMode: true,
      online: navigator.onLine,
      timestamp: new Date().toISOString(),
      message: "Service status check failed",
      error: error.message,
    };
  }
};

// Initialize all services
export const initializeServices = async () => {
  console.log("🔧 Initializing services...");

  try {
    // Check service status
    const status = await getServiceStatus();

    if (status.backendConnected) {
      console.log("✅ All services connected to live backend");
      localStorage.removeItem("useDemoMode");
    } else {
      console.log("🎭 Services running in demo mode");
      localStorage.setItem("useDemoMode", "true");
    }

    return {
      success: true,
      status,
      message: status.backendConnected
        ? "Services connected to live backend"
        : "Services running in demo mode",
    };
  } catch (error) {
    console.error("❌ Service initialization failed:", error);

    // Force demo mode on initialization failure
    localStorage.setItem("useDemoMode", "true");

    return {
      success: false,
      status: {
        backendConnected: false,
        demoMode: true,
        online: navigator.onLine,
        timestamp: new Date().toISOString(),
        message: "Initialization failed, using demo mode",
      },
      error: error.message,
    };
  }
};

// Export service configuration
export const serviceConfig = {
  apiBaseUrl:
    (typeof process !== "undefined" && process.env?.REACT_APP_API_URL) ||
    "http://localhost:3000/api/v1",
  timeout: 10000,
  retryAttempts: 3,
  retryDelay: 1000,
  enableDemo: true,
  enableFallback: true,
};
