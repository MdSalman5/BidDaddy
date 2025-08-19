import express from "express";

const router = express.Router();

// Demo data
const demoAuctions = [
  {
    _id: "demo1",
    title: "Vintage Digital Camera",
    description:
      "Professional DSLR camera in excellent condition. Perfect for photography enthusiasts.",
    image: {
      url: "https://images.unsplash.com/photo-1606983340126-99ab4b2c5c8d?w=400",
    },
    startingBid: 150,
    currentBid: 380,
    startTime: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    endTime: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
    category: "Electronics",
    condition: "Like New",
    createdBy: "auctioneer1",
    bids: [
      {
        bidder: "user1",
        amount: 200,
        timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
      },
      {
        bidder: "user2",
        amount: 250,
        timestamp: new Date(Date.now() - 20 * 60 * 60 * 1000),
      },
      {
        bidder: "user1",
        amount: 380,
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
      },
    ],
  },
  {
    _id: "demo2",
    title: "Antique Pocket Watch",
    description:
      "Beautiful gold-plated pocket watch from the 1920s. Fully functional and comes with chain.",
    image: {
      url: "https://images.unsplash.com/photo-1594534475808-b18fc33b045e?w=400",
    },
    startingBid: 200,
    currentBid: 450,
    startTime: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    endTime: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
    category: "Antiques",
    condition: "Good",
    createdBy: "auctioneer2",
    bids: [
      {
        bidder: "user2",
        amount: 250,
        timestamp: new Date(Date.now() - 18 * 60 * 60 * 1000),
      },
      {
        bidder: "user3",
        amount: 300,
        timestamp: new Date(Date.now() - 12 * 60 * 60 * 1000),
      },
      {
        bidder: "user1",
        amount: 450,
        timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000),
      },
    ],
  },
  {
    _id: "demo3",
    title: "Designer Handbag",
    description:
      "Luxury leather handbag from a premium brand. Rarely used, in pristine condition.",
    image: {
      url: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=400",
    },
    startingBid: 300,
    currentBid: 680,
    startTime: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    endTime: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000).toISOString(),
    category: "Fashion",
    condition: "Like New",
    createdBy: "auctioneer1",
    bids: [
      {
        bidder: "user1",
        amount: 350,
        timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      },
      {
        bidder: "user3",
        amount: 420,
        timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
      },
      {
        bidder: "user2",
        amount: 680,
        timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000),
      },
    ],
  },
  {
    _id: "demo4",
    title: "Collectible Art Print",
    description:
      "Limited edition art print signed by the artist. Only 100 copies were made.",
    image: {
      url: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400",
    },
    startingBid: 80,
    currentBid: 140,
    startTime: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
    endTime: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000).toISOString(),
    category: "Art & Collectibles",
    condition: "New",
    createdBy: "auctioneer2",
    bids: [
      {
        bidder: "user3",
        amount: 90,
        timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
      },
      {
        bidder: "user1",
        amount: 140,
        timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000),
      },
    ],
  },
];

const demoUsers = [
  {
    _id: "user1",
    name: "John Collector",
    email: "demo@bidder.com",
    role: "Bidder",
    auctionsWon: 12,
    moneySpent: 2450,
  },
  {
    _id: "user2",
    name: "Sarah Professional",
    email: "demo@auctioneer.com",
    role: "Auctioneer",
    auctionsWon: 8,
    moneySpent: 1680,
  },
  {
    _id: "user3",
    name: "Mike Premium",
    email: "john@collector.com",
    role: "Bidder",
    auctionsWon: 25,
    moneySpent: 8750,
  },
];

// Get all auctions
router.get("/auctions", (req, res) => {
  res.json({
    success: true,
    items: demoAuctions,
    message: "Demo auctions retrieved successfully",
  });
});

// Get auction by ID
router.get("/auction/:id", (req, res) => {
  const auction = demoAuctions.find((a) => a._id === req.params.id);
  if (!auction) {
    return res.status(404).json({
      success: false,
      message: "Auction not found",
    });
  }

  res.json({
    success: true,
    auctionItem: auction,
    message: "Auction retrieved successfully",
  });
});

// Login demo user
router.post("/login", (req, res) => {
  const { email, password } = req.body;

  if (password !== "demo123") {
    return res.status(401).json({
      success: false,
      message: "Invalid credentials",
    });
  }

  const user = demoUsers.find((u) => u.email === email);
  if (!user) {
    return res.status(401).json({
      success: false,
      message: "User not found",
    });
  }

  res.json({
    success: true,
    user,
    message: "Login successful",
  });
});

// Get user profile
router.get("/profile", (req, res) => {
  res.json({
    success: true,
    user: demoUsers[0],
    message: "Profile retrieved successfully",
  });
});

// Place bid
router.post("/bid/:auctionId", (req, res) => {
  const { auctionId } = req.params;
  const { amount } = req.body;

  const auction = demoAuctions.find((a) => a._id === auctionId);
  if (!auction) {
    return res.status(404).json({
      success: false,
      message: "Auction not found",
    });
  }

  if (amount <= auction.currentBid) {
    return res.status(400).json({
      success: false,
      message: "Bid must be higher than current bid",
    });
  }

  // Add bid
  auction.bids.push({
    bidder: "user1",
    amount,
    timestamp: new Date(),
  });
  auction.currentBid = amount;

  res.json({
    success: true,
    message: "Bid placed successfully",
  });
});

// Get leaderboard
router.get("/leaderboard", (req, res) => {
  const leaderboard = demoUsers
    .sort((a, b) => b.moneySpent - a.moneySpent)
    .map((user, index) => ({
      ...user,
      rank: index + 1,
    }));

  res.json({
    success: true,
    leaderboard,
    message: "Leaderboard retrieved successfully",
  });
});

export default router;
