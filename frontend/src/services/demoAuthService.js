// Demo users for testing without backend
const DEMO_USERS = [
  {
    _id: "demo1",
    userName: "demo_bidder",
    email: "demo@bidder.com",
    password: "demo123",
    role: "Bidder",
    phone: "+1234567890",
    address: "123 Demo Street, Demo City",
    profileImage: {
      url: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
    },
    moneySpent: 2500,
    auctionsWon: 5,
    unpaidCommission: 0,
  },
  {
    _id: "demo2",
    userName: "demo_auctioneer",
    email: "demo@auctioneer.com",
    password: "demo123",
    role: "Auctioneer",
    phone: "+1234567891",
    address: "456 Auction Lane, Bid City",
    profileImage: {
      url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
    },
    moneySpent: 0,
    auctionsWon: 0,
    unpaidCommission: 1200,
  },
  {
    _id: "demo3",
    userName: "john_collector",
    email: "john@collector.com",
    password: "demo123",
    role: "Bidder",
    phone: "+1234567892",
    address: "789 Collection Ave, Art City",
    profileImage: {
      url: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face",
    },
    moneySpent: 15750,
    auctionsWon: 12,
    unpaidCommission: 0,
  },
];

const DEMO_AUCTIONS = [
  {
    _id: "auction1",
    title: "Vintage Rolex Submariner Watch",
    description:
      "A classic 1970s Rolex Submariner in excellent condition. Perfect for collectors and enthusiasts.",
    category: "Jewelry & Watches",
    condition: "Good",
    startingBid: 5000,
    currentBid: 7850,
    startTime: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    endTime: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(), // 2 hours from now
    image: {
      url: "https://images.unsplash.com/photo-1523170335258-f5c6c6bd5bdc?w=400&h=300&fit=crop",
    },
    bids: [
      {
        userId: "demo1",
        userName: "demo_bidder",
        amount: 7850,
        profileImage: DEMO_USERS[0].profileImage.url,
      },
      {
        userId: "demo3",
        userName: "john_collector",
        amount: 7200,
        profileImage: DEMO_USERS[2].profileImage.url,
      },
    ],
    createdBy: "demo2",
  },
  {
    _id: "auction2",
    title: "Original Van Gogh Sketch",
    description:
      "An authentic sketch by Vincent van Gogh, professionally authenticated. A rare opportunity for art collectors.",
    category: "Art & Collectibles",
    condition: "Good",
    startingBid: 25000,
    currentBid: 45000,
    startTime: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    endTime: new Date(Date.now() + 6 * 60 * 60 * 1000).toISOString(), // 6 hours from now
    image: {
      url: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop",
    },
    bids: [
      {
        userId: "demo3",
        userName: "john_collector",
        amount: 45000,
        profileImage: DEMO_USERS[2].profileImage.url,
      },
      {
        userId: "demo1",
        userName: "demo_bidder",
        amount: 42000,
        profileImage: DEMO_USERS[0].profileImage.url,
      },
    ],
    createdBy: "demo2",
  },
  {
    _id: "auction3",
    title: "MacBook Pro M3 16-inch",
    description:
      "Brand new MacBook Pro with M3 chip, 32GB RAM, 1TB SSD. Still in original packaging.",
    category: "Electronics",
    condition: "New",
    startingBid: 2000,
    currentBid: 2450,
    startTime: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
    endTime: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000).toISOString(), // 1 day from now
    image: {
      url: "https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=400&h=300&fit=crop",
    },
    bids: [
      {
        userId: "demo1",
        userName: "demo_bidder",
        amount: 2450,
        profileImage: DEMO_USERS[0].profileImage.url,
      },
    ],
    createdBy: "demo2",
  },
  {
    _id: "auction4",
    title: "Classic 1965 Ford Mustang",
    description:
      "Fully restored 1965 Ford Mustang convertible. Red exterior with black interior. Runs perfectly.",
    category: "Vehicles",
    condition: "Like New",
    startingBid: 35000,
    currentBid: 35000,
    startTime: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(), // 2 hours from now
    endTime: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 days from now
    image: {
      url: "https://images.unsplash.com/photo-1494905998402-395d579af36f?w=400&h=300&fit=crop",
    },
    bids: [],
    createdBy: "demo2",
  },
];

export const demoAuthService = {
  // Login with demo credentials
  login: async (email, password) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const user = DEMO_USERS.find(
          (u) => u.email === email && u.password === password,
        );
        if (user) {
          const { password: _, ...userWithoutPassword } = user;
          localStorage.setItem("demoUser", JSON.stringify(userWithoutPassword));
          localStorage.setItem("demoAuctions", JSON.stringify(DEMO_AUCTIONS));
          resolve({
            success: true,
            message: "Login successful",
            user: userWithoutPassword,
          });
        } else {
          reject({
            message: "Invalid email or password",
          });
        }
      }, 1000); // Simulate network delay
    });
  },

  // Register demo user
  register: async (userData) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const existingUser = DEMO_USERS.find((u) => u.email === userData.email);
        if (existingUser) {
          reject({
            message: "User already exists with this email",
          });
          return;
        }

        const newUser = {
          _id: `demo${Date.now()}`,
          userName: userData.userName,
          email: userData.email,
          role: userData.role || "Bidder",
          phone: userData.phone,
          address: userData.address,
          profileImage: {
            url: "https://images.unsplash.com/photo-1633332755192-727a05c4013d?w=150&h=150&fit=crop&crop=face",
          },
          moneySpent: 0,
          auctionsWon: 0,
          unpaidCommission: 0,
        };

        DEMO_USERS.push(newUser);
        localStorage.setItem("demoUser", JSON.stringify(newUser));
        localStorage.setItem("demoAuctions", JSON.stringify(DEMO_AUCTIONS));

        resolve({
          success: true,
          message: "Registration successful",
          user: newUser,
        });
      }, 1500); // Simulate network delay
    });
  },

  // Get current user profile
  getProfile: async () => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const user = JSON.parse(localStorage.getItem("demoUser") || "null");
        if (user) {
          resolve({
            success: true,
            user,
          });
        } else {
          reject({
            message: "Not authenticated",
          });
        }
      }, 500);
    });
  },

  // Logout
  logout: async () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        localStorage.removeItem("demoUser");
        resolve({
          success: true,
          message: "Logged out successfully",
        });
      }, 300);
    });
  },

  // Get demo auctions
  getAuctions: async () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const auctions = JSON.parse(
          localStorage.getItem("demoAuctions") || JSON.stringify(DEMO_AUCTIONS),
        );
        resolve({
          success: true,
          items: auctions,
        });
      }, 800);
    });
  },

  // Get auction by ID
  getAuctionById: async (id) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const auctions = JSON.parse(
          localStorage.getItem("demoAuctions") || JSON.stringify(DEMO_AUCTIONS),
        );
        const auction = auctions.find((a) => a._id === id);
        if (auction) {
          resolve({
            success: true,
            auctionItem: auction,
            bidders: auction.bids.sort((a, b) => b.amount - a.amount),
          });
        } else {
          reject({
            message: "Auction not found",
          });
        }
      }, 600);
    });
  },

  // Place bid
  placeBid: async (auctionId, amount) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const user = JSON.parse(localStorage.getItem("demoUser") || "null");
        if (!user) {
          reject({ message: "Not authenticated" });
          return;
        }

        const auctions = JSON.parse(
          localStorage.getItem("demoAuctions") || JSON.stringify(DEMO_AUCTIONS),
        );
        const auctionIndex = auctions.findIndex((a) => a._id === auctionId);

        if (auctionIndex === -1) {
          reject({ message: "Auction not found" });
          return;
        }

        const auction = auctions[auctionIndex];
        if (amount <= auction.currentBid) {
          reject({ message: "Bid must be higher than current bid" });
          return;
        }

        // Update or add bid
        const existingBidIndex = auction.bids.findIndex(
          (b) => b.userId === user._id,
        );
        if (existingBidIndex !== -1) {
          auction.bids[existingBidIndex].amount = amount;
        } else {
          auction.bids.push({
            userId: user._id,
            userName: user.userName,
            amount: amount,
            profileImage: user.profileImage.url,
          });
        }

        auction.currentBid = amount;
        localStorage.setItem("demoAuctions", JSON.stringify(auctions));

        resolve({
          success: true,
          message: "Bid placed successfully",
          currentBid: amount,
        });
      }, 1000);
    });
  },

  // Get leaderboard
  getLeaderboard: async () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const leaderboard = DEMO_USERS.filter(
          (user) => user.moneySpent > 0,
        ).sort((a, b) => b.moneySpent - a.moneySpent);

        resolve({
          success: true,
          leaderboard,
        });
      }, 700);
    });
  },
};

export { DEMO_USERS, DEMO_AUCTIONS };
