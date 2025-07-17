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
    console.warn("Backend unavailable for bidding, falling back to demo mode");
    localStorage.setItem("useDemoMode", "true");
    return fallbackAction();
  }

  // Client errors (400-499) should be thrown as is
  throw error;
};

export const bidService = {
  // Place a bid on an auction
  placeBid: async (auctionId, amount) => {
    if (isDemoMode()) {
      return demoAuthService.placeBid(auctionId, amount);
    }

    try {
      const response = await api.post(`/bid/place/${auctionId}`, { amount });
      return response;
    } catch (error) {
      return handleApiError(error, () =>
        demoAuthService.placeBid(auctionId, amount),
      );
    }
  },

  // Get user's bids
  getMyBids: async () => {
    if (isDemoMode()) {
      return demoAuthService.getMyBids();
    }

    try {
      const response = await api.get("/bid/mybids");
      return response;
    } catch (error) {
      return handleApiError(error, () => demoAuthService.getMyBids());
    }
  },

  // Get bid history for an auction
  getBidHistory: async (auctionId) => {
    if (isDemoMode()) {
      return demoAuthService.getBidHistory(auctionId);
    }

    try {
      const response = await api.get(`/bid/history/${auctionId}`);
      return response;
    } catch (error) {
      return handleApiError(error, () =>
        demoAuthService.getBidHistory(auctionId),
      );
    }
  },

  // Get live bid updates for an auction
  getBidUpdates: async (auctionId) => {
    if (isDemoMode()) {
      return demoAuthService.getBidHistory(auctionId);
    }

    try {
      const response = await api.get(`/bid/updates/${auctionId}`);
      return response;
    } catch (error) {
      return handleApiError(error, () =>
        demoAuthService.getBidHistory(auctionId),
      );
    }
  },

  // Cancel a bid (if allowed)
  cancelBid: async (bidId) => {
    if (isDemoMode()) {
      throw new Error("Canceling bids not available in demo mode");
    }

    try {
      const response = await api.delete(`/bid/cancel/${bidId}`);
      return response;
    } catch (error) {
      return handleApiError(error, () => {
        throw new Error("Canceling bids not available in demo mode");
      });
    }
  },

  // Get winning bids for user
  getWinningBids: async () => {
    if (isDemoMode()) {
      return demoAuthService.getWinningBids();
    }

    try {
      const response = await api.get("/bid/winning");
      return response;
    } catch (error) {
      return handleApiError(error, () => demoAuthService.getWinningBids());
    }
  },

  // Auto-bid functionality
  setupAutoBid: async (auctionId, maxAmount, increment) => {
    if (isDemoMode()) {
      throw new Error("Auto-bidding not available in demo mode");
    }

    try {
      const response = await api.post(`/bid/auto/${auctionId}`, {
        maxAmount,
        increment,
      });
      return response;
    } catch (error) {
      return handleApiError(error, () => {
        throw new Error("Auto-bidding not available in demo mode");
      });
    }
  },

  // Remove auto-bid
  removeAutoBid: async (auctionId) => {
    if (isDemoMode()) {
      throw new Error("Auto-bidding not available in demo mode");
    }

    try {
      const response = await api.delete(`/bid/auto/${auctionId}`);
      return response;
    } catch (error) {
      return handleApiError(error, () => {
        throw new Error("Auto-bidding not available in demo mode");
      });
    }
  },
};
