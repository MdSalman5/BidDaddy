import React from "react";
import { Link } from "react-router-dom";
import { Clock, DollarSign, User } from "lucide-react";

const AuctionCard = ({ auction, isEnded = false }) => {
  const formatTimeRemaining = (endTime) => {
    const now = new Date();
    const end = new Date(endTime);
    const diff = end - now;

    if (diff <= 0) return "Ended";

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

    if (days > 0) return `${days}d ${hours}h`;
    if (hours > 0) return `${hours}h ${minutes}m`;
    return `${minutes}m`;
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  return (
    <div
      className={`bg-white rounded-lg shadow-md overflow-hidden transition-transform hover:scale-105 ${isEnded ? "opacity-75" : ""}`}
    >
      <div className="relative">
        <img
          src={auction.image?.url || "/placeholder-image.jpg"}
          alt={auction.title}
          className="w-full h-48 object-cover"
        />
        <div
          className={`absolute top-2 right-2 px-2 py-1 rounded-full text-xs font-medium ${
            isEnded ? "bg-gray-500 text-white" : "bg-green-500 text-white"
          }`}
        >
          {isEnded ? "Ended" : "Active"}
        </div>
      </div>

      <div className="p-4">
        <h3 className="font-semibold text-lg text-gray-900 mb-2 line-clamp-2">
          {auction.title}
        </h3>

        <p className="text-gray-600 text-sm mb-3 line-clamp-2">
          {auction.description}
        </p>

        <div className="space-y-2 mb-4">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-500">Current Bid</span>
            <div className="flex items-center text-green-600 font-semibold">
              <DollarSign className="w-4 h-4 mr-1" />
              {formatCurrency(auction.currentBid || auction.startingBid)}
            </div>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-500">Bids</span>
            <div className="flex items-center text-gray-700">
              <User className="w-4 h-4 mr-1" />
              {auction.bids?.length || 0}
            </div>
          </div>

          {!isEnded && (
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-500">Time Left</span>
              <div className="flex items-center text-orange-600 font-medium">
                <Clock className="w-4 h-4 mr-1" />
                {formatTimeRemaining(auction.endTime)}
              </div>
            </div>
          )}
        </div>

        <div className="flex space-x-2">
          <Link
            to={`/auction/${auction._id}`}
            className="flex-1 bg-blue-600 text-white text-center py-2 px-4 rounded-md hover:bg-blue-700 transition-colors text-sm font-medium"
          >
            View Details
          </Link>
          {!isEnded && (
            <Link
              to={`/auction/${auction._id}?bid=true`}
              className="flex-1 bg-green-600 text-white text-center py-2 px-4 rounded-md hover:bg-green-700 transition-colors text-sm font-medium"
            >
              Place Bid
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};

export default AuctionCard;
