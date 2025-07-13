// Utility functions for handling fetch errors safely

/**
 * Safe fetch wrapper that handles common fetch errors
 * @param {string} url - The URL to fetch
 * @param {object} options - Fetch options
 * @param {number} timeout - Timeout in milliseconds (default: 5000)
 * @returns {Promise} - Fetch response or throws descriptive error
 */
export const safeFetch = async (url, options = {}, timeout = 5000) => {
  // Create AbortController for timeout
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);

  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
    });

    clearTimeout(timeoutId);
    return response;
  } catch (error) {
    clearTimeout(timeoutId);

    // Handle different types of errors
    if (error.name === "AbortError") {
      throw new Error(`Request timeout after ${timeout}ms`);
    } else if (error.message.includes("Failed to fetch")) {
      throw new Error("Network error or server unavailable");
    } else if (error.message.includes("CORS")) {
      throw new Error("Cross-origin request blocked");
    } else {
      throw new Error(`Fetch failed: ${error.message}`);
    }
  }
};

/**
 * Check if backend is healthy with safe error handling
 * @param {string} baseUrl - Backend base URL
 * @returns {Promise<boolean>} - True if backend is healthy
 */
export const checkBackendHealth = async (baseUrl = "http://localhost:3000") => {
  try {
    const response = await safeFetch(
      `${baseUrl}/api/v1/health`,
      {
        method: "GET",
        headers: {
          Accept: "application/json",
        },
      },
      3000,
    ); // 3 second timeout for health checks

    return response.ok;
  } catch (error) {
    console.warn("Backend health check failed:", error.message);
    return false;
  }
};

/**
 * Retry function with exponential backoff
 * @param {Function} fn - Function to retry
 * @param {number} maxRetries - Maximum number of retries
 * @param {number} baseDelay - Base delay in milliseconds
 * @returns {Promise} - Result of the function or throws after max retries
 */
export const retryWithBackoff = async (
  fn,
  maxRetries = 3,
  baseDelay = 1000,
) => {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      if (attempt === maxRetries) {
        throw error;
      }

      const delay = baseDelay * Math.pow(2, attempt - 1);
      console.warn(
        `Attempt ${attempt} failed, retrying in ${delay}ms:`,
        error.message,
      );
      await new Promise((resolve) => setTimeout(resolve, delay));
    }
  }
};

/**
 * Check if the error is a network-related error
 * @param {Error} error - The error to check
 * @returns {boolean} - True if it's a network error
 */
export const isNetworkError = (error) => {
  return (
    error.message.includes("Failed to fetch") ||
    error.message.includes("Network error") ||
    error.message.includes("timeout") ||
    error.name === "AbortError" ||
    error.code === "ERR_NETWORK"
  );
};

/**
 * Enable demo mode with user notification
 */
export const enableDemoMode = () => {
  localStorage.setItem("useDemoMode", "true");
  console.info("Demo mode enabled due to backend connectivity issues");
};

/**
 * Check if demo mode is active
 * @returns {boolean} - True if demo mode is active
 */
export const isDemoMode = () => {
  return localStorage.getItem("useDemoMode") === "true";
};

export default {
  safeFetch,
  checkBackendHealth,
  retryWithBackoff,
  isNetworkError,
  enableDemoMode,
  isDemoMode,
};
