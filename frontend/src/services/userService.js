import api from "./api";
import { demoAuthService } from "./demoAuthService";

const isDemoMode = () => {
  return localStorage.getItem("useDemoMode") === "true" || !navigator.onLine;
};

const handleApiError = (error, fallbackAction) => {
  // Network errors or server unavailable
  if (
    error.code === "ERR_NETWORK" ||
    error.code === "ECONNREFUSED" ||
    !navigator.onLine ||
    error.response?.status >= 500
  ) {
    console.warn(
      "Backend unavailable for user operations, falling back to demo mode",
    );
    localStorage.setItem("useDemoMode", "true");
    return fallbackAction();
  }

  // Client errors (400-499) should be thrown as is
  throw error;
};

export const userService = {
  // Get user profile
  getProfile: async () => {
    if (isDemoMode()) {
      return demoAuthService.getProfile();
    }

    try {
      const response = await api.get("/user/me");
      return response;
    } catch (error) {
      return handleApiError(error, () => demoAuthService.getProfile());
    }
  },

  // Update user profile
  updateProfile: async (profileData) => {
    if (isDemoMode()) {
      return demoAuthService.updateProfile(profileData);
    }

    try {
      const formData = new FormData();

      // Add text fields
      Object.keys(profileData).forEach((key) => {
        if (key !== "profileImage" && profileData[key] !== undefined) {
          if (typeof profileData[key] === "object") {
            formData.append(key, JSON.stringify(profileData[key]));
          } else {
            formData.append(key, profileData[key]);
          }
        }
      });

      // Add profile image if provided
      if (profileData.profileImage) {
        formData.append("profileImage", profileData.profileImage);
      }

      const response = await api.put("/user/profile", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      return response;
    } catch (error) {
      return handleApiError(error, () =>
        demoAuthService.updateProfile(profileData),
      );
    }
  },

  // Change password
  changePassword: async (currentPassword, newPassword) => {
    if (isDemoMode()) {
      return demoAuthService.changePassword(currentPassword, newPassword);
    }

    try {
      const response = await api.put("/user/change-password", {
        currentPassword,
        newPassword,
      });
      return response;
    } catch (error) {
      return handleApiError(error, () =>
        demoAuthService.changePassword(currentPassword, newPassword),
      );
    }
  },

  // Get user statistics
  getUserStats: async () => {
    if (isDemoMode()) {
      return demoAuthService.getUserStats();
    }

    try {
      const response = await api.get("/user/stats");
      return response;
    } catch (error) {
      return handleApiError(error, () => demoAuthService.getUserStats());
    }
  },

  // Get user's transaction history
  getTransactionHistory: async () => {
    if (isDemoMode()) {
      return demoAuthService.getTransactionHistory();
    }

    try {
      const response = await api.get("/user/transactions");
      return response;
    } catch (error) {
      return handleApiError(error, () =>
        demoAuthService.getTransactionHistory(),
      );
    }
  },

  // Update payment methods
  updatePaymentMethods: async (paymentData) => {
    if (isDemoMode()) {
      return demoAuthService.updatePaymentMethods(paymentData);
    }

    try {
      const response = await api.put("/user/payment-methods", paymentData);
      return response;
    } catch (error) {
      return handleApiError(error, () =>
        demoAuthService.updatePaymentMethods(paymentData),
      );
    }
  },

  // Get notification preferences
  getNotificationPreferences: async () => {
    if (isDemoMode()) {
      return demoAuthService.getNotificationPreferences();
    }

    try {
      const response = await api.get("/user/notifications");
      return response;
    } catch (error) {
      return handleApiError(error, () =>
        demoAuthService.getNotificationPreferences(),
      );
    }
  },

  // Update notification preferences
  updateNotificationPreferences: async (preferences) => {
    if (isDemoMode()) {
      return demoAuthService.updateNotificationPreferences(preferences);
    }

    try {
      const response = await api.put("/user/notifications", preferences);
      return response;
    } catch (error) {
      return handleApiError(error, () =>
        demoAuthService.updateNotificationPreferences(preferences),
      );
    }
  },

  // Delete user account
  deleteAccount: async (password) => {
    if (isDemoMode()) {
      throw new Error("Account deletion not available in demo mode");
    }

    try {
      const response = await api.delete("/user/account", {
        data: { password },
      });
      return response;
    } catch (error) {
      return handleApiError(error, () => {
        throw new Error("Account deletion not available in demo mode");
      });
    }
  },

  // Upload profile image
  uploadProfileImage: async (imageFile) => {
    if (isDemoMode()) {
      return demoAuthService.uploadProfileImage(imageFile);
    }

    try {
      const formData = new FormData();
      formData.append("profileImage", imageFile);

      const response = await api.post("/user/upload-image", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      return response;
    } catch (error) {
      return handleApiError(error, () =>
        demoAuthService.uploadProfileImage(imageFile),
      );
    }
  },

  // Get user's favorite auctions
  getFavoriteAuctions: async () => {
    if (isDemoMode()) {
      return demoAuthService.getFavoriteAuctions();
    }

    try {
      const response = await api.get("/user/favorites");
      return response;
    } catch (error) {
      return handleApiError(error, () => demoAuthService.getFavoriteAuctions());
    }
  },

  // Add auction to favorites
  addToFavorites: async (auctionId) => {
    if (isDemoMode()) {
      return demoAuthService.addToFavorites(auctionId);
    }

    try {
      const response = await api.post(`/user/favorites/${auctionId}`);
      return response;
    } catch (error) {
      return handleApiError(error, () =>
        demoAuthService.addToFavorites(auctionId),
      );
    }
  },

  // Remove auction from favorites
  removeFromFavorites: async (auctionId) => {
    if (isDemoMode()) {
      return demoAuthService.removeFromFavorites(auctionId);
    }

    try {
      const response = await api.delete(`/user/favorites/${auctionId}`);
      return response;
    } catch (error) {
      return handleApiError(error, () =>
        demoAuthService.removeFromFavorites(auctionId),
      );
    }
  },
};
