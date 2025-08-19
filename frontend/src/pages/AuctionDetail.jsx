import React, { useState, useEffect } from "react";
import { useParams, useSearchParams, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import {
  fetchAuctionDetails,
  placeBidOnAuction,
  clearError,
} from "../store/slices/auctionSlice";
import { toast } from "react-toastify";
import {
  Clock,
  DollarSign,
  User,
  Calendar,
  Package,
  MapPin,
  TrendingUp,
  Gavel,
  Heart,
  Share2,
  Flag,
  Info,
  Award,
  ChevronRight,
  Eye,
  MessageSquare,
} from "lucide-react";
import LoadingSpinner from "../components/LoadingSpinner";
import FloatingThemeToggle from "../components/FloatingThemeToggle";

const AuctionDetail = () => {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const shouldShowBidModal = searchParams.get("bid") === "true";
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [bidAmount, setBidAmount] = useState("");
  const [showBidModal, setShowBidModal] = useState(shouldShowBidModal);
  const [timeRemaining, setTimeRemaining] = useState("");
  const [isWatched, setIsWatched] = useState(false);
  const [activeTab, setActiveTab] = useState("details");

  const {
    currentAuction: auction,
    loading,
    error,
    bidLoading,
    bidError,
  } = useSelector((state) => state.auction);
  const { user, isAuthenticated } = useSelector((state) => state.auth);

  useEffect(() => {
    if (id) {
      dispatch(fetchAuctionDetails(id));
    }
  }, [dispatch, id]);

  useEffect(() => {
    if (bidError) {
      toast.error(bidError);
      dispatch(clearError());
    }
  }, [bidError, dispatch]);

  useEffect(() => {
    if (!auction) return;

    const updateTimer = () => {
      const now = new Date();
      const end = new Date(auction.endTime);
      const diff = end - now;

      if (diff <= 0) {
        setTimeRemaining("Ended");
        return;
      }

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor(
        (diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60),
      );
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      if (days > 0) {
        setTimeRemaining(`${days}d ${hours}h ${minutes}m ${seconds}s`);
      } else if (hours > 0) {
        setTimeRemaining(`${hours}h ${minutes}m ${seconds}s`);
      } else if (minutes > 0) {
        setTimeRemaining(`${minutes}m ${seconds}s`);
      } else {
        setTimeRemaining(`${seconds}s`);
      }
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, [auction]);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const handlePlaceBid = async () => {
    if (!isAuthenticated) {
      toast.error("Please login to place a bid");
      navigate("/login");
      return;
    }

    const amount = parseFloat(bidAmount);
    if (!amount || amount <= (auction.currentBid || auction.startingBid)) {
      toast.error("Bid amount must be higher than current bid");
      return;
    }

    const result = await dispatch(
      placeBidOnAuction({ auctionId: auction._id, amount }),
    );
    if (result.type === "auction/placeBid/fulfilled") {
      toast.success("Bid placed successfully!");
      setBidAmount("");
      setShowBidModal(false);
      // Refresh auction details
      dispatch(fetchAuctionDetails(id));
    }
  };

  const getMinimumBid = () => {
    const currentBid = auction?.currentBid || auction?.startingBid || 0;
    return currentBid + 1;
  };

  const isAuctionEnded = () => {
    return auction && new Date(auction.endTime) <= new Date();
  };

  const isAuctionStarted = () => {
    return auction && new Date(auction.startTime) <= new Date();
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-4">
            Error Loading Auction
          </h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => navigate("/dashboard")}
            className="btn-primary"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  if (!auction) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Auction Not Found
          </h2>
          <p className="text-gray-600 mb-4">
            The auction you're looking for doesn't exist.
          </p>
          <button
            onClick={() => navigate("/dashboard")}
            className="btn-primary"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      <FloatingThemeToggle position="top-right" variant="modern" />

      {/* Breadcrumb */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <nav className="flex items-center space-x-2 text-sm">
            <button
              onClick={() => navigate("/dashboard")}
              className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 transition-colors"
            >
              Dashboard
            </button>
            <ChevronRight className="w-4 h-4 text-gray-400" />
            <button
              onClick={() => navigate("/auctions")}
              className="text-blue-600 hover:text-blue-800"
            >
              Auctions
            </button>
            <ChevronRight className="w-4 h-4 text-gray-400" />
            <span className="text-gray-900 font-medium truncate">
              {auction.title}
            </span>
          </nav>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Image */}
            <div className="card">
              <div className="relative">
                <img
                  src={auction.image?.url || "/placeholder-image.jpg"}
                  alt={auction.title}
                  className="w-full h-96 object-cover rounded-lg"
                />
                <div className="absolute top-4 left-4">
                  <span
                    className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold ${
                      isAuctionEnded()
                        ? "bg-gray-900 text-white"
                        : isAuctionStarted()
                          ? "bg-green-500 text-white"
                          : "bg-blue-500 text-white"
                    }`}
                  >
                    {isAuctionEnded()
                      ? "Ended"
                      : isAuctionStarted()
                        ? "Live"
                        : "Upcoming"}
                  </span>
                </div>
                <div className="absolute top-4 right-4 flex space-x-2">
                  <button
                    onClick={() => setIsWatched(!isWatched)}
                    className="w-10 h-10 bg-white bg-opacity-90 hover:bg-opacity-100 rounded-full flex items-center justify-center transition-all duration-200 shadow-md"
                  >
                    <Heart
                      className={`w-5 h-5 ${isWatched ? "text-red-500 fill-current" : "text-gray-600"}`}
                    />
                  </button>
                  <button className="w-10 h-10 bg-white bg-opacity-90 hover:bg-opacity-100 rounded-full flex items-center justify-center transition-all duration-200 shadow-md">
                    <Share2 className="w-5 h-5 text-gray-600" />
                  </button>
                  <button className="w-10 h-10 bg-white bg-opacity-90 hover:bg-opacity-100 rounded-full flex items-center justify-center transition-all duration-200 shadow-md">
                    <Flag className="w-5 h-5 text-gray-600" />
                  </button>
                </div>
              </div>
            </div>

            {/* Auction Info */}
            <div className="card">
              <div className="p-8">
                <div className="flex items-start justify-between mb-6">
                  <div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">
                      {auction.title}
                    </h1>
                    <div className="flex items-center space-x-4 text-sm text-gray-600">
                      <span className="flex items-center">
                        <Package className="w-4 h-4 mr-1" />
                        Category: {auction.category || "General"}
                      </span>
                      <span className="flex items-center">
                        <MapPin className="w-4 h-4 mr-1" />
                        Online Auction
                      </span>
                      <span className="flex items-center">
                        <Eye className="w-4 h-4 mr-1" />
                        {Math.floor(Math.random() * 1000) + 100} views
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-600">Condition</p>
                    <span
                      className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                        auction.condition === "New"
                          ? "bg-green-100 text-green-800"
                          : auction.condition === "Like New"
                            ? "bg-blue-100 text-blue-800"
                            : auction.condition === "Good"
                              ? "bg-yellow-100 text-yellow-800"
                              : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {auction.condition || "Used"}
                    </span>
                  </div>
                </div>

                {/* Tabs */}
                <div className="border-b border-gray-200 mb-6">
                  <nav className="-mb-px flex space-x-8">
                    {[
                      { id: "details", label: "Description", icon: Info },
                      {
                        id: "bidding",
                        label: "Bidding History",
                        icon: TrendingUp,
                      },
                      { id: "seller", label: "Seller Info", icon: User },
                    ].map((tab) => {
                      const Icon = tab.icon;
                      return (
                        <button
                          key={tab.id}
                          onClick={() => setActiveTab(tab.id)}
                          className={`flex items-center space-x-2 py-2 px-1 border-b-2 font-medium text-sm ${
                            activeTab === tab.id
                              ? "border-blue-500 text-blue-600"
                              : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                          }`}
                        >
                          <Icon className="w-4 h-4" />
                          <span>{tab.label}</span>
                        </button>
                      );
                    })}
                  </nav>
                </div>

                {/* Tab Content */}
                <div>
                  {activeTab === "details" && (
                    <div className="prose max-w-none">
                      <p className="text-gray-700 leading-relaxed text-lg">
                        {auction.description}
                      </p>

                      <div className="mt-8 grid grid-cols-2 gap-6">
                        <div>
                          <h4 className="font-semibold text-gray-900 mb-2">
                            Auction Details
                          </h4>
                          <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                              <span className="text-gray-600">
                                Starting Bid:
                              </span>
                              <span className="font-medium">
                                {formatCurrency(auction.startingBid)}
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600">Start Time:</span>
                              <span className="font-medium">
                                {new Date(auction.startTime).toLocaleString()}
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600">End Time:</span>
                              <span className="font-medium">
                                {new Date(auction.endTime).toLocaleString()}
                              </span>
                            </div>
                          </div>
                        </div>

                        <div>
                          <h4 className="font-semibold text-gray-900 mb-2">
                            Item Condition
                          </h4>
                          <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                              <span className="text-gray-600">Condition:</span>
                              <span className="font-medium">
                                {auction.condition || "Used"}
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600">Category:</span>
                              <span className="font-medium">
                                {auction.category || "General"}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {activeTab === "bidding" && (
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-4">
                        Bidding Activity
                      </h4>
                      {auction.bids && auction.bids.length > 0 ? (
                        <div className="space-y-3">
                          {auction.bids
                            .sort((a, b) => b.amount - a.amount)
                            .map((bid, index) => (
                              <div
                                key={index}
                                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                              >
                                <div className="flex items-center space-x-3">
                                  <img
                                    src={
                                      bid.profileImage || "/default-avatar.png"
                                    }
                                    alt={bid.userName}
                                    className="w-10 h-10 rounded-full object-cover"
                                  />
                                  <div>
                                    <p className="font-medium text-gray-900">
                                      {bid.userName}
                                    </p>
                                    <p className="text-sm text-gray-600">
                                      {index === 0 && (
                                        <Award className="w-4 h-4 inline mr-1 text-yellow-500" />
                                      )}
                                      {index === 0
                                        ? "Highest Bidder"
                                        : `Bid #${auction.bids.length - index}`}
                                    </p>
                                  </div>
                                </div>
                                <div className="text-right">
                                  <p className="font-bold text-lg text-green-600">
                                    {formatCurrency(bid.amount)}
                                  </p>
                                  <p className="text-sm text-gray-500">
                                    Just now
                                  </p>
                                </div>
                              </div>
                            ))}
                        </div>
                      ) : (
                        <div className="text-center py-8">
                          <Gavel className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                          <p className="text-gray-600">
                            No bids yet. Be the first to bid!
                          </p>
                        </div>
                      )}
                    </div>
                  )}

                  {activeTab === "seller" && (
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-4">
                        Seller Information
                      </h4>
                      <div className="flex items-start space-x-4 p-4 bg-gray-50 rounded-lg">
                        <img
                          src={
                            auction.createdBy?.profileImage ||
                            "/default-avatar.png"
                          }
                          alt="Seller"
                          className="w-16 h-16 rounded-full object-cover"
                        />
                        <div>
                          <h5 className="font-semibold text-gray-900">
                            Professional Seller
                          </h5>
                          <p className="text-gray-600 text-sm mb-2">
                            Verified Auctioneer
                          </p>
                          <div className="flex items-center space-x-4 text-sm">
                            <span className="flex items-center text-green-600">
                              <Award className="w-4 h-4 mr-1" />
                              98% Positive Feedback
                            </span>
                            <span className="text-gray-600">
                              50+ Items Sold
                            </span>
                          </div>
                          <button className="mt-3 text-blue-600 hover:text-blue-800 text-sm font-medium">
                            View Seller Profile
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Bidding Card */}
            <div className="card sticky top-8">
              <div className="p-6">
                {/* Current Bid */}
                <div className="text-center mb-6">
                  <p className="text-sm text-gray-600 mb-1">Current Bid</p>
                  <p className="text-4xl font-bold text-green-600">
                    {formatCurrency(auction.currentBid || auction.startingBid)}
                  </p>
                  {auction.bids && auction.bids.length > 0 && (
                    <p className="text-sm text-gray-600 mt-1">
                      {auction.bids.length}{" "}
                      {auction.bids.length === 1 ? "bid" : "bids"}
                    </p>
                  )}
                </div>

                {/* Time Remaining */}
                {!isAuctionEnded() && (
                  <div className="text-center mb-6 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border border-blue-100">
                    <div className="flex items-center justify-center space-x-2 mb-2">
                      <Clock className="w-5 h-5 text-blue-600" />
                      <p className="text-sm font-medium text-gray-700">
                        {isAuctionStarted() ? "Time Remaining" : "Starts In"}
                      </p>
                    </div>
                    <p className="text-2xl font-bold text-blue-600">
                      {timeRemaining}
                    </p>
                  </div>
                )}

                {/* Bidding Section */}
                {isAuctionStarted() && !isAuctionEnded() ? (
                  <div className="space-y-4">
                    <div>
                      <label
                        htmlFor="bidAmount"
                        className="block text-sm font-medium text-gray-700 mb-2"
                      >
                        Your Bid (Minimum: {formatCurrency(getMinimumBid())})
                      </label>
                      <div className="relative">
                        <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <input
                          type="number"
                          id="bidAmount"
                          value={bidAmount}
                          onChange={(e) => setBidAmount(e.target.value)}
                          min={getMinimumBid()}
                          className="input-field pl-10"
                          placeholder={getMinimumBid().toString()}
                        />
                      </div>
                    </div>

                    <button
                      onClick={() => setShowBidModal(true)}
                      disabled={
                        !bidAmount ||
                        parseFloat(bidAmount) <=
                          (auction.currentBid || auction.startingBid)
                      }
                      className="w-full btn-success disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Gavel className="w-5 h-5 mr-2" />
                      Place Bid
                    </button>

                    <div className="grid grid-cols-3 gap-2">
                      {[10, 25, 50].map((increment) => (
                        <button
                          key={increment}
                          onClick={() =>
                            setBidAmount(
                              (getMinimumBid() + increment).toString(),
                            )
                          }
                          className="text-sm py-2 px-3 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                        >
                          +${increment}
                        </button>
                      ))}
                    </div>
                  </div>
                ) : isAuctionEnded() ? (
                  <div className="text-center p-4 bg-gray-100 rounded-lg">
                    <p className="text-lg font-semibold text-gray-900 mb-2">
                      Auction Ended
                    </p>
                    {auction.highestBidder ? (
                      <p className="text-sm text-gray-600">
                        Won by{" "}
                        {auction.highestBidder.name || "Anonymous bidder"}
                      </p>
                    ) : (
                      <p className="text-sm text-gray-600">
                        No bids were placed
                      </p>
                    )}
                  </div>
                ) : (
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <p className="text-lg font-semibold text-blue-900 mb-2">
                      Auction Starting Soon
                    </p>
                    <p className="text-sm text-blue-700">
                      Bidding will begin at{" "}
                      {new Date(auction.startTime).toLocaleString()}
                    </p>
                  </div>
                )}

                {/* Watch/Login buttons */}
                <div className="mt-6 space-y-3">
                  {isAuthenticated ? (
                    <button
                      onClick={() => setIsWatched(!isWatched)}
                      className={`w-full py-3 px-4 rounded-lg font-semibold transition-all duration-200 ${
                        isWatched
                          ? "bg-red-100 text-red-700 hover:bg-red-200"
                          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                      }`}
                    >
                      <Heart
                        className={`w-5 h-5 mr-2 inline ${isWatched ? "fill-current" : ""}`}
                      />
                      {isWatched ? "Remove from Watchlist" : "Add to Watchlist"}
                    </button>
                  ) : (
                    <button
                      onClick={() => navigate("/login")}
                      className="w-full btn-primary"
                    >
                      Login to Bid
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="card">
              <div className="p-6">
                <h3 className="font-semibold text-gray-900 mb-4">
                  Auction Stats
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Starting Bid</span>
                    <span className="font-medium">
                      {formatCurrency(auction.startingBid)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Total Bids</span>
                    <span className="font-medium">
                      {auction.bids?.length || 0}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Watchers</span>
                    <span className="font-medium">
                      {Math.floor(Math.random() * 50) + 10}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Views</span>
                    <span className="font-medium">
                      {Math.floor(Math.random() * 1000) + 100}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bid Confirmation Modal */}
      {showBidModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4">
              Confirm Your Bid
            </h3>
            <div className="space-y-4">
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-600">You are bidding on:</p>
                <p className="font-semibold text-gray-900">{auction.title}</p>
                <p className="text-2xl font-bold text-green-600 mt-2">
                  {formatCurrency(parseFloat(bidAmount) || 0)}
                </p>
              </div>

              <div className="flex space-x-3">
                <button
                  onClick={() => setShowBidModal(false)}
                  className="flex-1 btn-secondary"
                >
                  Cancel
                </button>
                <button
                  onClick={handlePlaceBid}
                  disabled={bidLoading}
                  className="flex-1 btn-success"
                >
                  {bidLoading ? "Placing Bid..." : "Confirm Bid"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AuctionDetail;
