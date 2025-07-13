// Minimal connection service that gracefully handles all errors

class MinimalConnectionService {
  constructor() {
    this.isOnline = navigator.onLine;
    this.backendStatus = "unknown";
    this.listeners = new Set();
    this.healthCheckEnabled = false;

    this.init();
  }

  init() {
    // Check if backend is available before defaulting to demo mode
    this.updateBackendStatus("checking");

    // Listen for network events
    window.addEventListener("online", () => {
      this.isOnline = true;
      this.notifyListeners("network_online");
      // Check backend when network comes online
      this.performSafeHealthCheck();
    });

    window.addEventListener("offline", () => {
      this.isOnline = false;
      this.updateBackendStatus("offline");
      localStorage.setItem("useDemoMode", "true");
      this.notifyListeners("network_offline");
    });

    // Enable health checks immediately
    this.enableHealthChecks();
  }

  enableHealthChecks() {
    // Check if we're in localhost development
    const hostname = window.location.hostname;
    const isLocalhost = hostname === "localhost" || hostname === "127.0.0.1";

    if (!isLocalhost) {
      console.info("Not in localhost - health checks disabled");
      return;
    }

    // Check if user hasn't disabled health checks
    if (localStorage.getItem("disableHealthChecks") === "true") {
      console.info("Health checks disabled by user");
      return;
    }

    this.healthCheckEnabled = true;

    // Single health check after delay
    setTimeout(() => {
      this.performSafeHealthCheck();
    }, 3000);
  }

  async performSafeHealthCheck() {
    if (!this.healthCheckEnabled || !this.isOnline) {
      return;
    }

    try {
      // Use a very defensive fetch approach
      const isHealthy = await this.safeBackendCheck();

      if (isHealthy) {
        this.updateBackendStatus("online");
        // Auto-disable demo mode when backend is healthy
        localStorage.removeItem("useDemoMode");
        console.info("Backend is healthy - switched to live mode");
        this.notifyListeners("backend_available");
      } else {
        this.updateBackendStatus("offline");
        localStorage.setItem("useDemoMode", "true");
      }
    } catch (error) {
      console.warn("Health check failed safely:", error.message);
      this.updateBackendStatus("offline");

      // Disable further health checks if they keep failing
      localStorage.setItem("disableHealthChecks", "true");
    }
  }

  async safeBackendCheck() {
    return new Promise((resolve) => {
      // Always resolve, never reject to prevent errors
      const timeout = setTimeout(() => {
        resolve(false);
      }, 2000);

      try {
        // Use the most basic fetch possible
        fetch("http://localhost:3000/api/v1/health", {
          method: "GET",
          mode: "cors",
        })
          .then((response) => {
            clearTimeout(timeout);
            resolve(response && response.ok);
          })
          .catch(() => {
            clearTimeout(timeout);
            resolve(false);
          });
      } catch (error) {
        clearTimeout(timeout);
        resolve(false);
      }
    });
  }

  updateBackendStatus(status) {
    this.backendStatus = status;
    this.notifyListeners("backend_status_changed", { status });
  }

  subscribe(callback) {
    this.listeners.add(callback);
    return () => {
      this.listeners.delete(callback);
    };
  }

  notifyListeners(event, data = {}) {
    this.listeners.forEach((callback) => {
      try {
        callback({ type: event, ...data });
      } catch (error) {
        // Silently ignore listener errors
      }
    });
  }

  // Public API
  getConnectionStatus() {
    return {
      network: this.isOnline ? "online" : "offline",
      backend: this.backendStatus,
      demoMode: localStorage.getItem("useDemoMode") === "true",
      healthCheckEnabled: this.healthCheckEnabled,
    };
  }

  async forceHealthCheck() {
    if (this.healthCheckEnabled) {
      await this.performSafeHealthCheck();
      return this.backendStatus === "online";
    }
    return false;
  }

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

  // Allow users to re-enable health checks
  enableHealthChecksManually() {
    localStorage.removeItem("disableHealthChecks");
    this.healthCheckEnabled = true;
    this.performSafeHealthCheck();
  }

  disableHealthChecks() {
    localStorage.setItem("disableHealthChecks", "true");
    this.healthCheckEnabled = false;
  }
}

// Create singleton instance
const minimalConnectionService = new MinimalConnectionService();

export default minimalConnectionService;
