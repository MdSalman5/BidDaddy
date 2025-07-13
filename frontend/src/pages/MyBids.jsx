import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { auctionService } from "../services/auctionService";
import { toast } from "react-toastify";
import {
  TrendingUp,
  Clock,
  DollarSign,
  Eye,
  Award,
  Calendar,
  Loader2,
  Gavel,
} from "lucide-react";
import FloatingThemeToggle from "../components/FloatingThemeToggle";

const MyBids = () => {
  const { user } = useSelector((state) => state.auth);
  const [biddedAuctions, setBiddedAuctions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all"); // all, winning, outbid, won

  useEffect(() => {
    fetchBiddedAuctions();
  }, []);

  const fetchBiddedAuctions = async () => {
    setLoading(true);
    try {
      // Get all auctions and filter for ones where user has bid
      const response = await auctionService.getAllAuctions();
      if (response.success) {
        const userBids = (response.items || []).filter(
          (auction) =>
            auction.bids &&
            auction.bids.some(
              (bid) =>
                bid.bidder?._id === user?._id || bid.bidder === user?._id,
            ),
        );
        setBiddedAuctions(userBids);
      } else {
        throw new Error(response.message || "Failed to fetch bidded auctions");
      }
    } catch (error) {
      console.error("Fetch bidded auctions error:", error);
      toast.error(error.message || "Failed to fetch your bids");
    } finally {
      setLoading(false);
    }
  };

  const getUserHighestBid = (auction) => {
    if (!auction.bids || !user) return null;
    const userBids = auction.bids.filter(
      (bid) => bid.bidder?._id === user._id || bid.bidder === user._id,
    );
    if (userBids.length === 0) return null;
    return Math.max(...userBids.map((bid) => bid.amount));
  };

  const getBidStatus = (auction) => {
    const now = new Date();
    const endTime = new Date(auction.endTime);
    const isEnded = endTime <= now;
    const userHighestBid = getUserHighestBid(auction);
    const currentHighestBid = auction.currentBid || auction.startingBid;

    if (isEnded) {
      if (userHighestBid === currentHighestBid) {
        return { status: "won", label: "Won", color: "green" };
      } else {
        return { status: "lost", label: "Lost", color: "red" };
      }
    } else {
      if (userHighestBid === currentHighestBid) {
        return { status: "winning", label: "Winning", color: "green" };
      } else {
        return { status: "outbid", label: "Outbid", color: "orange" };
      }
    }
  };

  const getFilteredAuctions = () => {
    return biddedAuctions.filter((auction) => {
      const bidStatus = getBidStatus(auction);

      switch (filter) {
        case "winning":
          return bidStatus.status === "winning";
        case "outbid":
          return bidStatus.status === "outbid";
        case "won":
          return bidStatus.status === "won";
        case "lost":
          return bidStatus.status === "lost";
        default:
          return true;
      }
    });
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const getTotalSpent = () => {
    return biddedAuctions.reduce((total, auction) => {
      const bidStatus = getBidStatus(auction);
      if (bidStatus.status === "won") {
        return total + (getUserHighestBid(auction) || 0);
      }
      return total;
    }, 0);
  };

  const filteredAuctions = getFilteredAuctions();

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-400">
            Loading your bids...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      <FloatingThemeToggle position="top-right" variant="modern" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
            My Bids
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Track your bidding activity and auction results
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {[
            {
              label: "Total Bids",
              value: biddedAuctions.length,
              icon: Gavel,
              color: "blue",
            },
            {
              label: "Currently Winning",
              value: biddedAuctions.filter(
                (a) => getBidStatus(a).status === "winning",
              ).length,
              icon: TrendingUp,
              color: "green",
            },
            {
              label: "Auctions Won",
              value: biddedAuctions.filter(
                (a) => getBidStatus(a).status === "won",
              ).length,
              icon: Award,
              color: "purple",
            },
            {
              label: "Total Spent",
              value: formatCurrency(getTotalSpent()),
              icon: DollarSign,
              color: "orange",
            },
          ].map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div
                key={index}
                className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                      {stat.label}
                    </p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-gray-100 mt-1">
                      {stat.value}
                    </p>
                  </div>
                  <div
                    className={`p-3 rounded-lg bg-${stat.color}-100 dark:bg-${stat.color}-900/30`}
                  >
                    <Icon
                      className={`w-6 h-6 text-${stat.color}-600 dark:text-${stat.color}-400`}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-2 mb-6">
          {[
            { key: "all", label: "All Bids" },
            { key: "winning", label: "Winning" },
            { key: "outbid", label: "Outbid" },
            { key: "won", label: "Won" },
            { key: "lost", label: "Lost" },
          ].map((filterOption) => (
            <button
              key={filterOption.key}
              onClick={() => setFilter(filterOption.key)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                filter === filterOption.key
                  ? "bg-blue-600 text-white"
                  : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-700"
              }`}
            >
              {filterOption.label}
            </button>
          ))}
        </div>

        {/* Bids Grid */}
        {filteredAuctions.length === 0 ? (
          <div className="text-center py-12">
            <Gavel className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
              {filter === "all" ? "No bids yet" : `No ${filter} bids`}
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              {filter === "all"
                ? "Start bidding on auctions to see them here"
                : `You don't have any ${filter} bids at the moment`}
            </p>
            {filter === "all" && (
              <Link
                to="/auctions"
                className="inline-flex items-center px-6 py-3 bg-blue-600 dark:bg-blue-700 text-white font-semibold rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors"
              >
                <Eye className="w-5 h-5 mr-2" />
                Browse Auctions
              </Link>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredAuctions.map((auction) => {
              const bidStatus = getBidStatus(auction);
              const userHighestBid = getUserHighestBid(auction);
              const currentBid = auction.currentBid || auction.startingBid;

              return (
                <div
                  key={auction._id}
                  className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-shadow"
                >
                  {/* Image */}
                  <div className="relative h-48">
                    <img
                      src={auction.image?.url || "/placeholder-image.jpg"}
                      alt={auction.title}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.src = "/placeholder-image.jpg";
                      }}
                    />
                    <div className="absolute top-3 left-3">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-${bidStatus.color}-100 text-${bidStatus.color}-800 dark:bg-${bidStatus.color}-900/30 dark:text-${bidStatus.color}-300`}
                      >
                        {bidStatus.label}
                      </span>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-6">
                    <h3 className="font-semibold text-lg text-gray-900 dark:text-gray-100 mb-2 line-clamp-1">
                      {auction.title}
                    </h3>

                    {/* Bid Info */}
                    <div className="space-y-3 mb-4">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-500 dark:text-gray-400">
                          Your Highest Bid
                        </span>
                        <span className="font-semibold text-gray-900 dark:text-gray-100">
                          {formatCurrency(userHighestBid)}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-500 dark:text-gray-400">
                          Current Highest
                        </span>
                        <span className="font-semibold text-gray-900 dark:text-gray-100">
                          {formatCurrency(currentBid)}
                        </span>
                      </div>
                      {userHighestBid !== currentBid && (
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-500 dark:text-gray-400">
                            Difference
                          </span>
                          <span className="font-semibold text-red-600 dark:text-red-400">
                            +{formatCurrency(currentBid - userHighestBid)}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Time Info */}
                    <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mb-4">
                      <Clock className="w-4 h-4 mr-1" />
                      {new Date(auction.endTime) > new Date() ? (
                        <span>
                          Ends {new Date(auction.endTime).toLocaleDateString()}
                        </span>
                      ) : (
                        <span>
                          Ended {new Date(auction.endTime).toLocaleDateString()}
                        </span>
                      )}
                    </div>

                    {/* Action */}
                    <Link
                      to={`/auction/${auction._id}`}
                      className="w-full inline-flex items-center justify-center px-4 py-2 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 font-medium rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/50 transition-colors"
                    >
                      <Eye className="w-4 h-4 mr-2" />
                      View Auction
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyBids;
