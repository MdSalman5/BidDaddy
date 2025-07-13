// Safe wrapper around connection service to prevent runtime errors

class SafeConnectionService {
  constructor() {
    this.isOnline = navigator.onLine;
    this.backendStatus = "unknown";
    this.lastHealthCheck = null;
    this.listeners = new Set();
    this.retryAttempts = 0;
    this.maxRetries = 3;

    this.init();
  }

  init() {
    // Listen for online/offline events
    window.addEventListener("online", this.handleOnline.bind(this));
    window.addEventListener("offline", this.handleOffline.bind(this));

    // Start health checks with delay to avoid immediate errors
    setTimeout(() => {
      this.startHealthChecks();
      this.checkBackendHealth();
    }, 2000);
  }

  async checkBackendHealth() {
    // Skip if offline
    if (!this.isOnline) {
      this.updateBackendStatus("offline");
      return false;
    }

    // Skip health checks in production to avoid CORS issues
    if (
      window.location.hostname !== "localhost" &&
      window.location.hostname !== "127.0.0.1"
    ) {
      console.info("Skipping backend health check in production environment");
      this.updateBackendStatus("offline");
      localStorage.setItem("useDemoMode", "true");
      return false;
    }

    try {
      // Wrap fetch in additional try-catch to isolate FullStory interference
      let response;
      try {
        response = await this.performFetch();
      } catch (fetchError) {
        // If fetch fails completely, assume backend is offline
        throw new Error(
          `Fetch failed: ${fetchError.message || "Network error"}`,
        );
      }

      if (response && response.ok) {
        this.updateBackendStatus("online");
        this.retryAttempts = 0;
        return true;
      } else {
        throw new Error(
          `Backend returned ${response ? response.status : "no response"}`,
        );
      }
    } catch (error) {
      console.warn(
        "Backend health check failed, enabling demo mode:",
        error.message,
      );
      this.updateBackendStatus("offline");
      this.retryAttempts++;

      // Auto-enable demo mode after failed attempts
      if (this.retryAttempts >= this.maxRetries) {
        localStorage.setItem("useDemoMode", "true");
        this.notifyListeners("demo_mode_enabled", {
          reason: "backend_unavailable",
          error: error.message,
        });
      }

      return false;
    }
  }

  // Isolated fetch method to minimize external interference
  async performFetch() {
    // Use a more defensive approach
    const fetchFn = window.fetch || fetch;

    return new Promise((resolve, reject) => {
      const timeout = setTimeout(() => {
        reject(new Error("Request timeout"));
      }, 3000);

      fetchFn("http://localhost:3000/api/v1/health", {
        method: "GET",
        headers: {
          Accept: "application/json",
        },
        mode: "cors", // Explicitly set CORS mode
        cache: "no-cache", // Prevent caching issues
      })
        .then((response) => {
          clearTimeout(timeout);
          resolve(response);
        })
        .catch((error) => {
          clearTimeout(timeout);
          reject(error);
        });
    });
  }

  startHealthChecks() {
    // Check every 60 seconds (less frequent to avoid spam)
    this.healthCheckInterval = setInterval(() => {
      if (this.isOnline) {
        this.checkBackendHealth();
      }
    }, 60000);
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
    }, 2000);
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
    try {
      return await this.checkBackendHealth();
    } catch (error) {
      console.warn("Force health check failed:", error);
      return false;
    }
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

  destroy() {
    this.stopHealthChecks();
    window.removeEventListener("online", this.handleOnline);
    window.removeEventListener("offline", this.handleOffline);
    this.listeners.clear();
  }
}

// Create singleton instance
const safeConnectionService = new SafeConnectionService();

export default safeConnectionService;
