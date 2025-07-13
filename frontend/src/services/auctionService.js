import api from "./api";

export const auctionService = {
  // Get all auction items
  getAllAuctions: async () => {
    const response = await api.get("/auctionitem/allitems");
    return response;
  },

  // Get auction details by ID
  getAuctionDetails: async (id) => {
    const response = await api.get(`/auctionitem/auction/${id}`);
    return response;
  },

  // Get user's auction items
  getMyAuctions: async () => {
    const response = await api.get("/auctionitem/myitems");
    return response;
  },

  // Create new auction item
  createAuction: async (auctionData) => {
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
  },

  // Delete auction item
  deleteAuction: async (id) => {
    const response = await api.delete(`/auctionitem/delete/${id}`);
    return response;
  },

  // Republish auction item
  republishAuction: async (id, timeData) => {
    const response = await api.put(
      `/auctionitem/item/republish/${id}`,
      timeData,
    );
    return response;
  },

  // Place bid on auction
  placeBid: async (auctionId, amount) => {
    const response = await api.post(`/bid/place/${auctionId}`, { amount });
    return response;
  },
};
