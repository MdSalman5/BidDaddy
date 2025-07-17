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
      "Backend unavailable for dashboard, falling back to demo mode",
    );
    localStorage.setItem("useDemoMode", "true");
    return fallbackAction();
  }

  // Client errors (400-499) should be thrown as is
  throw error;
};

export const dashboardService = {
  // Get dashboard overview data
  getDashboardOverview: async () => {
    if (isDemoMode()) {
      return demoAuthService.getDashboardOverview();
    }

    try {
      const response = await api.get("/dashboard/overview");
      return response;
    } catch (error) {
      return handleApiError(error, () =>
        demoAuthService.getDashboardOverview(),
      );
    }
  },

  // Get recent activity
  getRecentActivity: async (limit = 10) => {
    if (isDemoMode()) {
      return demoAuthService.getRecentActivity(limit);
    }

    try {
      const response = await api.get(`/dashboard/activity?limit=${limit}`);
      return response;
    } catch (error) {
      return handleApiError(error, () =>
        demoAuthService.getRecentActivity(limit),
      );
    }
  },

  // Get user's auction performance
  getAuctionPerformance: async (period = "month") => {
    if (isDemoMode()) {
      return demoAuthService.getAuctionPerformance(period);
    }

    try {
      const response = await api.get(`/dashboard/performance?period=${period}`);
      return response;
    } catch (error) {
      return handleApiError(error, () =>
        demoAuthService.getAuctionPerformance(period),
      );
    }
  },

  // Get bidding analytics
  getBiddingAnalytics: async (period = "month") => {
    if (isDemoMode()) {
      return demoAuthService.getBiddingAnalytics(period);
    }

    try {
      const response = await api.get(
        `/dashboard/bidding-analytics?period=${period}`,
      );
      return response;
    } catch (error) {
      return handleApiError(error, () =>
        demoAuthService.getBiddingAnalytics(period),
      );
    }
  },

  // Get revenue analytics (for auctioneers)
  getRevenueAnalytics: async (period = "month") => {
    if (isDemoMode()) {
      return demoAuthService.getRevenueAnalytics(period);
    }

    try {
      const response = await api.get(`/dashboard/revenue?period=${period}`);
      return response;
    } catch (error) {
      return handleApiError(error, () =>
        demoAuthService.getRevenueAnalytics(period),
      );
    }
  },

  // Get trending auctions
  getTrendingAuctions: async (limit = 5) => {
    if (isDemoMode()) {
      return demoAuthService.getTrendingAuctions(limit);
    }

    try {
      const response = await api.get(`/dashboard/trending?limit=${limit}`);
      return response;
    } catch (error) {
      return handleApiError(error, () =>
        demoAuthService.getTrendingAuctions(limit),
      );
    }
  },

  // Get recommended auctions
  getRecommendedAuctions: async (limit = 5) => {
    if (isDemoMode()) {
      return demoAuthService.getRecommendedAuctions(limit);
    }

    try {
      const response = await api.get(
        `/dashboard/recommendations?limit=${limit}`,
      );
      return response;
    } catch (error) {
      return handleApiError(error, () =>
        demoAuthService.getRecommendedAuctions(limit),
      );
    }
  },

  // Get notifications
  getNotifications: async (limit = 10, unreadOnly = false) => {
    if (isDemoMode()) {
      return demoAuthService.getNotifications(limit, unreadOnly);
    }

    try {
      const response = await api.get(
        `/dashboard/notifications?limit=${limit}&unreadOnly=${unreadOnly}`,
      );
      return response;
    } catch (error) {
      return handleApiError(error, () =>
        demoAuthService.getNotifications(limit, unreadOnly),
      );
    }
  },

  // Mark notification as read
  markNotificationRead: async (notificationId) => {
    if (isDemoMode()) {
      return demoAuthService.markNotificationRead(notificationId);
    }

    try {
      const response = await api.put(
        `/dashboard/notifications/${notificationId}/read`,
      );
      return response;
    } catch (error) {
      return handleApiError(error, () =>
        demoAuthService.markNotificationRead(notificationId),
      );
    }
  },

  // Mark all notifications as read
  markAllNotificationsRead: async () => {
    if (isDemoMode()) {
      return demoAuthService.markAllNotificationsRead();
    }

    try {
      const response = await api.put("/dashboard/notifications/read-all");
      return response;
    } catch (error) {
      return handleApiError(error, () =>
        demoAuthService.markAllNotificationsRead(),
      );
    }
  },

  // Get quick stats
  getQuickStats: async () => {
    if (isDemoMode()) {
      return demoAuthService.getQuickStats();
    }

    try {
      const response = await api.get("/dashboard/quick-stats");
      return response;
    } catch (error) {
      return handleApiError(error, () => demoAuthService.getQuickStats());
    }
  },

  // Get upcoming auctions ending soon
  getEndingSoon: async (limit = 5) => {
    if (isDemoMode()) {
      return demoAuthService.getEndingSoon(limit);
    }

    try {
      const response = await api.get(`/dashboard/ending-soon?limit=${limit}`);
      return response;
    } catch (error) {
      return handleApiError(error, () => demoAuthService.getEndingSoon(limit));
    }
  },

  // Get user's watching auctions
  getWatchingAuctions: async () => {
    if (isDemoMode()) {
      return demoAuthService.getWatchingAuctions();
    }

    try {
      const response = await api.get("/dashboard/watching");
      return response;
    } catch (error) {
      return handleApiError(error, () => demoAuthService.getWatchingAuctions());
    }
  },
};
