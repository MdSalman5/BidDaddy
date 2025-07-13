import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchAllAuctions } from "../store/slices/auctionSlice";
import AuctionCard from "../components/AuctionCard";
import LoadingSpinner from "../components/LoadingSpinner";
import { Search, Filter } from "lucide-react";

const Dashboard = () => {
  const dispatch = useDispatch();
  const { auctions, loading, error } = useSelector((state) => state.auction);
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(fetchAllAuctions());
  }, [dispatch]);

  const activeAuctions = auctions.filter(
    (auction) => new Date(auction.endTime) > new Date(),
  );

  const endedAuctions = auctions.filter(
    (auction) => new Date(auction.endTime) <= new Date(),
  );

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-4">
            Error Loading Auctions
          </h2>
          <p className="text-gray-600">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Welcome back, {user?.userName}!
              </h1>
              <p className="mt-1 text-sm text-gray-500">
                Discover amazing auction items and place your bids
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search auctions..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <button className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50">
            <Filter className="w-5 h-5 mr-2" />
            Filters
          </button>
        </div>

        {/* Active Auctions */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">
              Active Auctions
            </h2>
            <span className="bg-green-100 text-green-800 text-sm font-medium px-3 py-1 rounded-full">
              {activeAuctions.length} active
            </span>
          </div>

          {activeAuctions.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {activeAuctions.map((auction) => (
                <AuctionCard key={auction._id} auction={auction} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="text-gray-400 text-6xl mb-4">🏷️</div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No active auctions
              </h3>
              <p className="text-gray-500">
                Check back soon for new auction items!
              </p>
            </div>
          )}
        </div>

        {/* Recently Ended Auctions */}
        {endedAuctions.length > 0 && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">
                Recently Ended
              </h2>
              <span className="bg-gray-100 text-gray-800 text-sm font-medium px-3 py-1 rounded-full">
                {endedAuctions.length} ended
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {endedAuctions.slice(0, 8).map((auction) => (
                <AuctionCard
                  key={auction._id}
                  auction={auction}
                  isEnded={true}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
