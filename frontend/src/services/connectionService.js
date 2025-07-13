import api from "./api";

class ConnectionService {
  constructor() {
    this.isOnline = navigator.onLine;
    this.backendStatus = "unknown"; // 'online', 'offline', 'unknown'
    this.lastHealthCheck = null;
    this.healthCheckInterval = null;
    this.listeners = new Set();
    this.retryAttempts = 0;
    this.maxRetries = 3;

    this.init();
  }

  init() {
    // Listen for online/offline events
    window.addEventListener("online", this.handleOnline.bind(this));
    window.addEventListener("offline", this.handleOffline.bind(this));

    // Start health checks
    this.startHealthChecks();

    // Initial health check
    this.checkBackendHealth();
  }

  async checkBackendHealth() {
    try {
      // Create AbortController for timeout since fetch doesn't have a timeout option
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000);

      const response = await fetch("http://localhost:3000/api/v1/health", {
        method: "GET",
        signal: controller.signal,
        headers: {
          Accept: "application/json",
        },
      });

      clearTimeout(timeoutId);

      if (response.ok) {
        this.updateBackendStatus("online");
        this.retryAttempts = 0;
        return true;
      } else {
        throw new Error(`Backend returned ${response.status}`);
      }
    } catch (error) {
      console.warn("Backend health check failed:", error.message);
      this.updateBackendStatus("offline");
      this.retryAttempts++;

      // Auto-enable demo mode after failed attempts
      if (this.retryAttempts >= this.maxRetries) {
        localStorage.setItem("useDemoMode", "true");
        this.notifyListeners("demo_mode_enabled", {
          reason: "backend_unavailable",
        });
      }

      return false;
    }
  }

  startHealthChecks() {
    // Check every 30 seconds
    this.healthCheckInterval = setInterval(() => {
      if (this.isOnline) {
        this.checkBackendHealth();
      }
    }, 30000);
  }

  stopHealthChecks() {
    if (this.healthCheckInterval) {
      clearInterval(this.healthCheckInterval);
      this.healthCheckInterval = null;
    }
  }

  handleOnline() {
    this.isOnline = true;
    this.notifyListeners("network_online");

    // Check backend when coming online
    setTimeout(() => {
      this.checkBackendHealth();
    }, 1000);
  }

  handleOffline() {
    this.isOnline = false;
    this.updateBackendStatus("offline");
    this.notifyListeners("network_offline");
  }

  updateBackendStatus(status) {
    const previousStatus = this.backendStatus;
    this.backendStatus = status;
    this.lastHealthCheck = new Date();

    if (previousStatus !== status) {
      this.notifyListeners("backend_status_changed", {
        previous: previousStatus,
        current: status,
      });
    }
  }

  // Subscribe to connection events
  subscribe(callback) {
    this.listeners.add(callback);

    // Return unsubscribe function
    return () => {
      this.listeners.delete(callback);
    };
  }

  notifyListeners(event, data = {}) {
    this.listeners.forEach((callback) => {
      try {
        callback({ type: event, ...data });
      } catch (error) {
        console.error("Error in connection listener:", error);
      }
    });
  }

  // Public API
  isBackendOnline() {
    return this.backendStatus === "online";
  }

  isNetworkOnline() {
    return this.isOnline;
  }

  getConnectionStatus() {
    return {
      network: this.isOnline ? "online" : "offline",
      backend: this.backendStatus,
      lastHealthCheck: this.lastHealthCheck,
      demoMode: localStorage.getItem("useDemoMode") === "true",
    };
  }

  async forceHealthCheck() {
    return await this.checkBackendHealth();
  }

  // Enable/disable demo mode
  setDemoMode(enabled) {
    if (enabled) {
      localStorage.setItem("useDemoMode", "true");
    } else {
      localStorage.removeItem("useDemoMode");
    }

    this.notifyListeners("demo_mode_changed", { enabled });
  }

  isDemoMode() {
    return localStorage.getItem("useDemoMode") === "true";
  }

  // Cleanup
  destroy() {
    this.stopHealthChecks();
    window.removeEventListener("online", this.handleOnline);
    window.removeEventListener("offline", this.handleOffline);
    this.listeners.clear();
  }
}

// Create singleton instance
const connectionService = new ConnectionService();

export default connectionService;

// React hook for easier usage - import React in component files that use this
export const createConnectionHook = (React) => {
  return () => {
    const [status, setStatus] = React.useState(
      connectionService.getConnectionStatus(),
    );

    React.useEffect(() => {
      const unsubscribe = connectionService.subscribe((event) => {
        setStatus(connectionService.getConnectionStatus());
      });

      return unsubscribe;
    }, []);

    return {
      ...status,
      forceCheck: () => connectionService.forceHealthCheck(),
      setDemoMode: (enabled) => connectionService.setDemoMode(enabled),
    };
  };
};
