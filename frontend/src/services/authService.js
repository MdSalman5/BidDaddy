import api from "./api";

export const authService = {
  // Register new user
  register: async (userData) => {
    const formData = new FormData();

    // Add text fields
    Object.keys(userData).forEach((key) => {
      if (key !== "profileImage" && userData[key] !== undefined) {
        if (typeof userData[key] === "object") {
          formData.append(key, JSON.stringify(userData[key]));
        } else {
          formData.append(key, userData[key]);
        }
      }
    });

    // Add profile image
    if (userData.profileImage) {
      formData.append("profileImage", userData.profileImage);
    }

    const response = await api.post("/user/register", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return response;
  },

  // Login user
  login: async (email, password) => {
    const response = await api.post("/user/login", { email, password });
    return response;
  },

  // Get current user profile
  getProfile: async () => {
    const response = await api.get("/user/me");
    return response;
  },

  // Logout user
  logout: async () => {
    const response = await api.get("/user/logout");
    return response;
  },

  // Get leaderboard
  getLeaderboard: async () => {
    const response = await api.get("/user/leaderboard");
    return response;
  },
};
