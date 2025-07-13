import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { auctionService } from "../services/auctionService";
import { toast } from "react-toastify";
import {
  Plus,
  Edit,
  Trash2,
  Eye,
  Clock,
  DollarSign,
  Users,
  TrendingUp,
  Calendar,
  Loader2,
} from "lucide-react";
import FloatingThemeToggle from "../components/FloatingThemeToggle";

const MyAuctions = () => {
  const { user } = useSelector((state) => state.auth);
  const [auctions, setAuctions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all"); // all, active, ended, upcoming

  useEffect(() => {
    fetchMyAuctions();
  }, []);

  const fetchMyAuctions = async () => {
    setLoading(true);
    try {
      const response = await auctionService.getMyAuctions();
      if (response.success) {
        setAuctions(response.items || []);
      } else {
        throw new Error(response.message || "Failed to fetch auctions");
      }
    } catch (error) {
      console.error("Fetch auctions error:", error);
      toast.error(error.message || "Failed to fetch your auctions");
    } finally {
      setLoading(false);
    }
  };

  const deleteAuction = async (auctionId) => {
    if (!window.confirm("Are you sure you want to delete this auction?")) {
      return;
    }

    try {
      const response = await auctionService.deleteAuction(auctionId);
      if (response.success) {
        toast.success("Auction deleted successfully");
        setAuctions(auctions.filter((auction) => auction._id !== auctionId));
      } else {
        throw new Error(response.message || "Failed to delete auction");
      }
    } catch (error) {
      console.error("Delete auction error:", error);
      toast.error(error.message || "Failed to delete auction");
    }
  };

  const getFilteredAuctions = () => {
    const now = new Date();
    return auctions.filter((auction) => {
      const startTime = new Date(auction.startTime);
      const endTime = new Date(auction.endTime);

      switch (filter) {
        case "active":
          return startTime <= now && endTime > now;
        case "ended":
          return endTime <= now;
        case "upcoming":
          return startTime > now;
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

  const getAuctionStatus = (auction) => {
    const now = new Date();
    const startTime = new Date(auction.startTime);
    const endTime = new Date(auction.endTime);

    if (endTime <= now) {
      return { status: "ended", label: "Ended", color: "gray" };
    } else if (startTime <= now && endTime > now) {
      return { status: "active", label: "Live", color: "green" };
    } else {
      return { status: "upcoming", label: "Upcoming", color: "blue" };
    }
  };

  const filteredAuctions = getFilteredAuctions();

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-400">
            Loading your auctions...
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
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
              My Auctions
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2">
              Manage your auction listings and track their performance
            </p>
          </div>
          <Link
            to="/create-auction"
            className="mt-4 sm:mt-0 inline-flex items-center px-6 py-3 bg-blue-600 dark:bg-blue-700 text-white font-semibold rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600 transition-all duration-300 hover:scale-105 active:scale-95"
          >
            <Plus className="w-5 h-5 mr-2" />
            Create New Auction
          </Link>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {[
            {
              label: "Total Auctions",
              value: auctions.length,
              icon: TrendingUp,
              color: "blue",
            },
            {
              label: "Active",
              value: auctions.filter((a) => {
                const now = new Date();
                return (
                  new Date(a.startTime) <= now && new Date(a.endTime) > now
                );
              }).length,
              icon: Clock,
              color: "green",
            },
            {
              label: "Total Revenue",
              value: formatCurrency(
                auctions.reduce(
                  (sum, a) => sum + (a.currentBid || a.startingBid || 0),
                  0,
                ),
              ),
              icon: DollarSign,
              color: "purple",
            },
            {
              label: "Total Bids",
              value: auctions.reduce(
                (sum, a) => sum + (a.bids?.length || 0),
                0,
              ),
              icon: Users,
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
            { key: "all", label: "All Auctions" },
            { key: "active", label: "Active" },
            { key: "upcoming", label: "Upcoming" },
            { key: "ended", label: "Ended" },
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

        {/* Auctions Grid */}
        {filteredAuctions.length === 0 ? (
          <div className="text-center py-12">
            <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
              {filter === "all" ? "No auctions yet" : `No ${filter} auctions`}
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              {filter === "all"
                ? "Start by creating your first auction listing"
                : `You don't have any ${filter} auctions at the moment`}
            </p>
            {filter === "all" && (
              <Link
                to="/create-auction"
                className="inline-flex items-center px-6 py-3 bg-blue-600 dark:bg-blue-700 text-white font-semibold rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors"
              >
                <Plus className="w-5 h-5 mr-2" />
                Create Your First Auction
              </Link>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredAuctions.map((auction) => {
              const status = getAuctionStatus(auction);
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
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-${status.color}-100 text-${status.color}-800 dark:bg-${status.color}-900/30 dark:text-${status.color}-300`}
                      >
                        {status.label}
                      </span>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-6">
                    <h3 className="font-semibold text-lg text-gray-900 dark:text-gray-100 mb-2 line-clamp-1">
                      {auction.title}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-2">
                      {auction.description}
                    </p>

                    {/* Stats */}
                    <div className="flex justify-between items-center mb-4">
                      <div>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          Current Bid
                        </p>
                        <p className="font-semibold text-gray-900 dark:text-gray-100">
                          {formatCurrency(
                            auction.currentBid || auction.startingBid,
                          )}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          Bids
                        </p>
                        <p className="font-semibold text-gray-900 dark:text-gray-100">
                          {auction.bids?.length || 0}
                        </p>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex space-x-2">
                      <Link
                        to={`/auction/${auction._id}`}
                        className="flex-1 inline-flex items-center justify-center px-3 py-2 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-sm font-medium rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/50 transition-colors"
                      >
                        <Eye className="w-4 h-4 mr-1" />
                        View
                      </Link>
                      {status.status !== "ended" && (
                        <button
                          onClick={() => deleteAuction(auction._id)}
                          className="flex-1 inline-flex items-center justify-center px-3 py-2 bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 text-sm font-medium rounded-lg hover:bg-red-100 dark:hover:bg-red-900/50 transition-colors"
                        >
                          <Trash2 className="w-4 h-4 mr-1" />
                          Delete
                        </button>
                      )}
                    </div>
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

export default MyAuctions;
