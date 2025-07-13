// Global error handler to catch and handle any remaining fetch errors

class GlobalErrorHandler {
  constructor() {
    this.setupErrorHandlers();
    this.errorCount = 0;
    this.maxErrors = 5;
  }

  setupErrorHandlers() {
    // Handle unhandled promise rejections (including fetch failures)
    window.addEventListener("unhandledrejection", (event) => {
      this.handleUnhandledRejection(event);
    });

    // Handle global errors
    window.addEventListener("error", (event) => {
      this.handleGlobalError(event);
    });

    // Override console.error to catch fetch errors from third-party scripts
    const originalConsoleError = console.error;
    console.error = (...args) => {
      this.handleConsoleError(args);
      originalConsoleError.apply(console, args);
    };
  }

  handleUnhandledRejection(event) {
    const error = event.reason;

    // Check if this is a fetch-related error
    if (this.isFetchError(error)) {
      console.warn("Caught unhandled fetch rejection:", error.message);

      // Prevent the error from reaching the console if it's a known fetch issue
      if (this.isKnownFetchIssue(error)) {
        event.preventDefault();
        this.enableDemoModeIfNeeded();
      }
    }
  }

  handleGlobalError(event) {
    const error = event.error;

    if (this.isFetchError(error)) {
      console.warn("Caught global fetch error:", error.message);
      this.enableDemoModeIfNeeded();
    }
  }

  handleConsoleError(args) {
    const errorMessage = args.join(" ");

    if (
      errorMessage.includes("Failed to fetch") ||
      errorMessage.includes("TypeError: Failed to fetch")
    ) {
      this.errorCount++;
      this.enableDemoModeIfNeeded();
    }
  }

  isFetchError(error) {
    if (!error) return false;

    const errorMessage = error.message || error.toString();
    return (
      errorMessage.includes("Failed to fetch") ||
      errorMessage.includes("fetch") ||
      errorMessage.includes("Network request failed") ||
      (error.name === "TypeError" && errorMessage.includes("fetch"))
    );
  }

  isKnownFetchIssue(error) {
    const errorMessage = error.message || error.toString();

    // Known issues that we can safely ignore
    return (
      errorMessage.includes("localhost:3000") ||
      errorMessage.includes("health") ||
      errorMessage.includes("CORS") ||
      errorMessage.includes("ERR_CONNECTION_REFUSED")
    );
  }

  enableDemoModeIfNeeded() {
    this.errorCount++;

    if (this.errorCount >= this.maxErrors) {
      console.info(
        "Multiple fetch errors detected - ensuring demo mode is enabled",
      );
      localStorage.setItem("useDemoMode", "true");
      localStorage.setItem("disableHealthChecks", "true");

      // Reset counter to prevent spam
      this.errorCount = 0;
    }
  }

  // Allow manual reset
  reset() {
    this.errorCount = 0;
    localStorage.removeItem("disableHealthChecks");
  }
}

// Initialize the global error handler
const globalErrorHandler = new GlobalErrorHandler();

export default globalErrorHandler;
