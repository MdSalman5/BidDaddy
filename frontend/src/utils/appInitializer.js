// Simplified app utilities - no complex initialization

// Check if user should be auto-logged in
export const shouldAutoLogin = () => {
  const token = localStorage.getItem("token");
  const demoUser = localStorage.getItem("demoUser");
  return Boolean(token || demoUser);
};

// Get app configuration
export const getAppConfig = () => {
  const isDemoMode = localStorage.getItem("useDemoMode") === "true" || !navigator.onLine;
  const isOnline = navigator.onLine;

  return {
    isDemoMode,
    isOnline,
    version: "1.0.0",
    environment: "production"
  };
};

// Setup basic connection monitoring
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
