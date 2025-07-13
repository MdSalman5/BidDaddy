import api from "./api";
import { demoAuthService } from "./demoAuthService";

const isDemoMode = () => {
  return localStorage.getItem("useDemoMode") === "true" || !navigator.onLine;
};

export const auctionService = {
  // Get all auction items
  getAllAuctions: async () => {
    if (isDemoMode()) {
      return demoAuthService.getAuctions();
    }

    try {
      const response = await api.get("/auctionitem/allitems");
      return response;
    } catch (error) {
      // Fallback to demo mode on network error
      if (error.code === "ERR_NETWORK" || error.code === "ECONNREFUSED") {
        localStorage.setItem("useDemoMode", "true");
        return demoAuthService.getAuctions();
      }
      throw error;
    }
  },

  // Get auction details by ID
  getAuctionDetails: async (id) => {
    if (isDemoMode()) {
      return demoAuthService.getAuctionById(id);
    }

    try {
      const response = await api.get(`/auctionitem/auction/${id}`);
      return response;
    } catch (error) {
      // Fallback to demo mode on network error
      if (error.code === "ERR_NETWORK" || error.code === "ECONNREFUSED") {
        localStorage.setItem("useDemoMode", "true");
        return demoAuthService.getAuctionById(id);
      }
      throw error;
    }
  },

  // Get user's auction items
  getMyAuctions: async () => {
    if (isDemoMode()) {
      // Return auctions created by current user
      const auctions = await demoAuthService.getAuctions();
      const currentUser = JSON.parse(localStorage.getItem("demoUser") || "{}");
      return {
        ...auctions,
        items: auctions.items.filter(
          (auction) => auction.createdBy === currentUser._id,
        ),
      };
    }

    try {
      const response = await api.get("/auctionitem/myitems");
      return response;
    } catch (error) {
      // Fallback to demo mode on network error
      if (error.code === "ERR_NETWORK" || error.code === "ECONNREFUSED") {
        localStorage.setItem("useDemoMode", "true");
        const auctions = await demoAuthService.getAuctions();
        const currentUser = JSON.parse(
          localStorage.getItem("demoUser") || "{}",
        );
        return {
          ...auctions,
          items: auctions.items.filter(
            (auction) => auction.createdBy === currentUser._id,
          ),
        };
      }
      throw error;
    }
  },

  // Create new auction item
  createAuction: async (auctionData) => {
    if (isDemoMode()) {
      // Demo mode doesn't support creating auctions yet
      throw new Error("Creating auctions not available in demo mode");
    }

    try {
      const formData = new FormData();

      // Add text fields
      Object.keys(auctionData).forEach((key) => {
        if (key !== "image" && auctionData[key] !== undefined) {
          formData.append(key, auctionData[key]);
        }
      });

      // Add auction image
      if (auctionData.image) {
        formData.append("image", auctionData.image);
      }

      const response = await api.post("/auctionitem/create", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      return response;
    } catch (error) {
      // Fallback to demo mode on network error
      if (error.code === "ERR_NETWORK" || error.code === "ECONNREFUSED") {
        localStorage.setItem("useDemoMode", "true");
        throw new Error("Creating auctions not available in demo mode");
      }
      throw error;
    }
  },

  // Delete auction item
  deleteAuction: async (id) => {
    if (isDemoMode()) {
      throw new Error("Deleting auctions not available in demo mode");
    }

    try {
      const response = await api.delete(`/auctionitem/delete/${id}`);
      return response;
    } catch (error) {
      // Fallback to demo mode on network error
      if (error.code === "ERR_NETWORK" || error.code === "ECONNREFUSED") {
        localStorage.setItem("useDemoMode", "true");
        throw new Error("Deleting auctions not available in demo mode");
      }
      throw error;
    }
  },

  // Republish auction item
  republishAuction: async (id, timeData) => {
    if (isDemoMode()) {
      throw new Error("Republishing auctions not available in demo mode");
    }

    try {
      const response = await api.put(
        `/auctionitem/item/republish/${id}`,
        timeData,
      );
      return response;
    } catch (error) {
      // Fallback to demo mode on network error
      if (error.code === "ERR_NETWORK" || error.code === "ECONNREFUSED") {
        localStorage.setItem("useDemoMode", "true");
        throw new Error("Republishing auctions not available in demo mode");
      }
      throw error;
    }
  },

  // Place bid on auction
  placeBid: async (auctionId, amount) => {
    if (isDemoMode()) {
      return demoAuthService.placeBid(auctionId, amount);
    }

    try {
      const response = await api.post(`/bid/place/${auctionId}`, { amount });
      return response;
    } catch (error) {
      // Fallback to demo mode on network error
      if (error.code === "ERR_NETWORK" || error.code === "ECONNREFUSED") {
        localStorage.setItem("useDemoMode", "true");
        return demoAuthService.placeBid(auctionId, amount);
      }
      throw error;
    }
  },
};
