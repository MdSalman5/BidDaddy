import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Clock,
  DollarSign,
  User,
  Eye,
  Heart,
  Gavel,
  Calendar,
  MapPin,
} from "lucide-react";

const AuctionCard = ({ auction, isEnded = false, showWatchlist = true }) => {
  const [timeRemaining, setTimeRemaining] = useState("");
  const [isWatched, setIsWatched] = useState(false);

  useEffect(() => {
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
        setTimeRemaining(`${days}d ${hours}h ${minutes}m`);
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
  }, [auction.endTime]);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const getTimeColor = () => {
    const now = new Date();
    const end = new Date(auction.endTime);
    const diff = end - now;
    const hoursLeft = diff / (1000 * 60 * 60);

    if (hoursLeft <= 0) return "text-gray-500";
    if (hoursLeft <= 1) return "text-red-600";
    if (hoursLeft <= 24) return "text-orange-600";
    return "text-green-600";
  };

  const getBidColor = () => {
    const currentBid = auction.currentBid || auction.startingBid;
    if (currentBid >= auction.startingBid * 3) return "text-purple-600";
    if (currentBid >= auction.startingBid * 2) return "text-blue-600";
    return "text-green-600";
  };

  const handleWatchlistToggle = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsWatched(!isWatched);
  };

  return (
    <div
      className={`card card-hover group relative overflow-hidden transition-all duration-300 ${isEnded ? "opacity-80" : ""} hover:scale-[1.02] active:scale-[0.98]`}
    >
      {/* Auction Status Badge */}
      <div className="absolute top-2 left-2 sm:top-4 sm:left-4 z-10">
        <span
          className={`inline-flex items-center px-2 py-1 sm:px-3 sm:py-1 rounded-full text-xs font-semibold backdrop-blur-sm ${
            isEnded
              ? "bg-gray-900/90 text-white"
              : auction.currentBid > auction.startingBid
                ? "bg-green-500/90 text-white"
                : "bg-blue-500/90 text-white"
          }`}
        >
          {isEnded
            ? "Ended"
            : auction.currentBid > auction.startingBid
              ? "Live Bidding"
              : "Starting Soon"}
        </span>
      </div>

      {/* Watchlist Button */}
      {showWatchlist && !isEnded && (
        <button
          onClick={handleWatchlistToggle}
          className="absolute top-2 right-2 sm:top-4 sm:right-4 z-10 w-8 h-8 sm:w-10 sm:h-10 bg-white/90 dark:bg-gray-800/90 hover:bg-white dark:hover:bg-gray-700 backdrop-blur-sm rounded-full flex items-center justify-center transition-all duration-300 shadow-md hover:shadow-lg hover:scale-110 active:scale-95"
        >
          <Heart
            className={`w-4 h-4 sm:w-5 sm:h-5 transition-colors ${
              isWatched
                ? "text-red-500 fill-current"
                : "text-gray-600 dark:text-gray-400 hover:text-red-500"
            }`}
          />
        </button>
      )}

      {/* Image */}
      <div className="relative overflow-hidden bg-gray-100 dark:bg-gray-800">
        <img
          src={auction.image?.url || "/placeholder-image.jpg"}
          alt={auction.title}
          className="w-full h-56 object-cover transition-transform duration-300 group-hover:scale-105"
          onError={(e) => {
            e.target.src = "/placeholder-image.jpg";
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      </div>

      <div className="p-6">
        {/* Category */}
        <div className="flex items-center justify-between mb-3">
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium bg-gray-100 text-gray-800">
            {auction.category || "General"}
          </span>
          <span className="text-xs text-gray-500 flex items-center">
            <MapPin className="w-3 h-3 mr-1" />
            Online
          </span>
        </div>

        {/* Title */}
        <h3 className="font-bold text-lg text-gray-900 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
          {auction.title}
        </h3>

        {/* Description */}
        <p className="text-gray-600 text-sm mb-4 line-clamp-2 leading-relaxed">
          {auction.description}
        </p>

        {/* Condition */}
        {auction.condition && (
          <div className="mb-4">
            <span
              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                auction.condition === "New"
                  ? "bg-green-100 text-green-800"
                  : auction.condition === "Like New"
                    ? "bg-blue-100 text-blue-800"
                    : auction.condition === "Good"
                      ? "bg-yellow-100 text-yellow-800"
                      : "bg-gray-100 text-gray-800"
              }`}
            >
              Condition: {auction.condition}
            </span>
          </div>
        )}

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-gray-50 rounded-lg p-3">
            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-500 font-medium">
                Current Bid
              </span>
              <DollarSign className="w-4 h-4 text-gray-400" />
            </div>
            <div className={`text-lg font-bold ${getBidColor()} mt-1`}>
              {formatCurrency(auction.currentBid || auction.startingBid)}
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Starting: {formatCurrency(auction.startingBid)}
            </p>
          </div>

          <div className="bg-gray-50 rounded-lg p-3">
            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-500 font-medium">Bids</span>
              <User className="w-4 h-4 text-gray-400" />
            </div>
            <div className="text-lg font-bold text-gray-900 mt-1">
              {auction.bids?.length || 0}
            </div>
            <p className="text-xs text-gray-500 mt-1">
              {auction.bids?.length === 1 ? "bidder" : "bidders"}
            </p>
          </div>
        </div>

        {/* Time Remaining */}
        {!isEnded && (
          <div className="mb-6 p-3 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border border-blue-100">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700">
                Time Remaining
              </span>
              <Clock className="w-4 h-4 text-gray-400" />
            </div>
            <div className={`text-xl font-bold ${getTimeColor()} mt-1`}>
              {timeRemaining}
            </div>
          </div>
        )}

        {/* Start Time for future auctions */}
        {new Date(auction.startTime) > new Date() && (
          <div className="mb-6 p-3 bg-yellow-50 rounded-lg border border-yellow-200">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700">Starts</span>
              <Calendar className="w-4 h-4 text-yellow-600" />
            </div>
            <div className="text-lg font-bold text-yellow-700 mt-1">
              {new Date(auction.startTime).toLocaleDateString()} at{" "}
              {new Date(auction.startTime).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-3">
          <Link
            to={`/auction/${auction._id}`}
            className="flex-1 bg-blue-600 text-white text-center py-3 px-4 rounded-lg hover:bg-blue-700 transition-all duration-200 font-semibold text-sm flex items-center justify-center space-x-2 group"
          >
            <Eye className="w-4 h-4 group-hover:scale-110 transition-transform" />
            <span>View Details</span>
          </Link>

          {!isEnded && new Date(auction.startTime) <= new Date() && (
            <Link
              to={`/auction/${auction._id}?bid=true`}
              className="flex-1 bg-green-600 text-white text-center py-3 px-4 rounded-lg hover:bg-green-700 transition-all duration-200 font-semibold text-sm flex items-center justify-center space-x-2 group"
            >
              <Gavel className="w-4 h-4 group-hover:scale-110 transition-transform" />
              <span>Place Bid</span>
            </Link>
          )}
        </div>

        {/* Winner Badge for ended auctions */}
        {isEnded && auction.highestBidder && (
          <div className="mt-4 p-3 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg border border-yellow-200">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center">
                <Gavel className="w-4 h-4 text-white" />
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-900">
                  Won by {auction.highestBidder.name || "Anonymous"}
                </p>
                <p className="text-xs text-gray-600">
                  Final bid: {formatCurrency(auction.currentBid)}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AuctionCard;
