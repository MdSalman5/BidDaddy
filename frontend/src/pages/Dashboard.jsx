import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchAllAuctions } from "../store/slices/auctionSlice";
import { authService } from "../services/authService";
import AuctionCard from "../components/AuctionCard";
import LoadingSpinner from "../components/LoadingSpinner";
import {
  Search,
  TrendingUp,
  Gavel,
  Clock,
  DollarSign,
  User,
  Award,
  ArrowUpRight,
  Plus,
  Eye,
  Heart,
  Star,
  Trophy,
} from "lucide-react";
import { Link } from "react-router-dom";
import FloatingThemeToggle from "../components/FloatingThemeToggle";

const Dashboard = () => {
  const dispatch = useDispatch();
  const { auctions, loading, error } = useSelector((state) => state.auction);
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(fetchAllAuctions());
  }, [dispatch]);

  const activeAuctions = auctions.filter(
    (auction) =>
      new Date(auction.endTime) > new Date() &&
      new Date(auction.startTime) <= new Date(),
  );

  const endingSoonAuctions = activeAuctions
    .filter((auction) => {
      const timeLeft = new Date(auction.endTime) - new Date();
      return timeLeft <= 24 * 60 * 60 * 1000; // 24 hours
    })
    .sort((a, b) => new Date(a.endTime) - new Date(b.endTime))
    .slice(0, 4);

  const hotAuctions = activeAuctions
    .filter((auction) => auction.bids && auction.bids.length >= 5)
    .sort((a, b) => (b.bids?.length || 0) - (a.bids?.length || 0))
    .slice(0, 4);

  const recentlyEndedAuctions = auctions
    .filter((auction) => new Date(auction.endTime) <= new Date())
    .sort((a, b) => new Date(b.endTime) - new Date(a.endTime))
    .slice(0, 4);

  const statsCards = [
    {
      title: "Active Auctions",
      value: activeAuctions.length,
      icon: Gavel,
      color: "blue",
      change: "+12%",
      isPositive: true,
    },
    {
      title: "Total Value",
      value: `$${activeAuctions.reduce((sum, auction) => sum + (auction.currentBid || auction.startingBid), 0).toLocaleString()}`,
      icon: DollarSign,
      color: "green",
      change: "+8%",
      isPositive: true,
    },
    {
      title: "Total Bidders",
      value: activeAuctions.reduce(
        (sum, auction) => sum + (auction.bids?.length || 0),
        0,
      ),
      icon: User,
      color: "purple",
      change: "+15%",
      isPositive: true,
    },
    {
      title: "Your Wins",
      value: user?.auctionsWon || 0,
      icon: Trophy,
      color: "yellow",
      change: user?.auctionsWon > 0 ? "+1" : "0",
      isPositive: true,
    },
  ];

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-4">
            Error Loading Dashboard
          </h2>
          <p className="text-gray-600">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      <FloatingThemeToggle position="top-right" variant="modern" />

      {/* Hero Section */}
      <div className="bg-gradient-auction text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div className="mb-6 md:mb-0">
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-2">
                Welcome back, {user?.userName || "Auction Lover"}! 🎉
              </h1>
              <p className="text-blue-100 text-base sm:text-lg">
                Discover amazing auction items and place your winning bids
              </p>
            </div>
            <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4">
              <Link
                to="/auctions"
                className="inline-flex items-center justify-center px-4 sm:px-6 py-3 bg-white text-blue-600 font-semibold rounded-lg hover:bg-blue-50 transition-all duration-300 hover:scale-105 active:scale-95"
              >
                <Search className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                <span className="text-sm sm:text-base">Browse Auctions</span>
              </Link>
              {user?.role === "Auctioneer" && (
                <Link
                  to="/create-auction"
                  className="inline-flex items-center justify-center px-4 sm:px-6 py-3 bg-blue-800 text-white font-semibold rounded-lg hover:bg-blue-900 transition-all duration-300 hover:scale-105 active:scale-95"
                >
                  <Plus className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                  <span className="text-sm sm:text-base">Create Auction</span>
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6 sm:space-y-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {statsCards.map((stat) => {
            const Icon = stat.icon;
            return (
              <div key={stat.title} className="card card-hover group">
                <div className="p-4 sm:p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">
                        {stat.title}
                      </p>
                      <p className="text-3xl font-bold text-gray-900 mt-2">
                        {stat.value}
                      </p>
                    </div>
                    <div
                      className={`w-12 h-12 rounded-xl bg-${stat.color}-100 flex items-center justify-center`}
                    >
                      <Icon className={`w-6 h-6 text-${stat.color}-600`} />
                    </div>
                  </div>
                  <div className="mt-4 flex items-center">
                    <span
                      className={`text-sm font-medium ${
                        stat.isPositive ? "text-green-600" : "text-red-600"
                      }`}
                    >
                      {stat.change}
                    </span>
                    <span className="text-sm text-gray-600 ml-2">
                      from last month
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Quick Actions */}
        <div className="card">
          <div className="p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              Quick Actions
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                {
                  title: "Browse All",
                  icon: Search,
                  path: "/auctions",
                  color: "blue",
                },
                {
                  title: "Watchlist",
                  icon: Heart,
                  path: "/watchlist",
                  color: "red",
                },
                {
                  title: "My Bids",
                  icon: Gavel,
                  path: "/my-bids",
                  color: "green",
                },
                {
                  title: "Leaderboard",
                  icon: TrendingUp,
                  path: "/leaderboard",
                  color: "purple",
                },
              ].map((action) => {
                const Icon = action.icon;
                return (
                  <Link
                    key={action.title}
                    to={action.path}
                    className={`group p-4 rounded-xl border-2 border-${action.color}-100 hover:border-${action.color}-200 hover:bg-${action.color}-50 transition-all duration-200`}
                  >
                    <Icon
                      className={`w-8 h-8 text-${action.color}-600 mb-2 group-hover:scale-110 transition-transform`}
                    />
                    <p className="font-semibold text-gray-900">
                      {action.title}
                    </p>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>

        {/* Ending Soon */}
        {endingSoonAuctions.length > 0 && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-red-100 rounded-xl flex items-center justify-center">
                  <Clock className="w-6 h-6 text-red-600" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">
                    Ending Soon
                  </h2>
                  <p className="text-gray-600">
                    Don't miss these opportunities!
                  </p>
                </div>
              </div>
              <Link
                to="/auctions?sort=ending-soon"
                className="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium"
              >
                View All
                <ArrowUpRight className="w-5 h-5 ml-1" />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {endingSoonAuctions.map((auction) => (
                <AuctionCard key={auction._id} auction={auction} />
              ))}
            </div>
          </div>
        )}

        {/* Hot Auctions */}
        {hotAuctions.length > 0 && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-orange-100 rounded-xl flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-orange-600" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">
                    Hot Auctions
                  </h2>
                  <p className="text-gray-600">
                    Popular items with active bidding
                  </p>
                </div>
              </div>
              <Link
                to="/auctions?sort=most-bids"
                className="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium"
              >
                View All
                <ArrowUpRight className="w-5 h-5 ml-1" />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {hotAuctions.map((auction) => (
                <AuctionCard key={auction._id} auction={auction} />
              ))}
            </div>
          </div>
        )}

        {/* Recently Ended */}
        {recentlyEndedAuctions.length > 0 && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center">
                  <Award className="w-6 h-6 text-gray-600" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">
                    Recently Ended
                  </h2>
                  <p className="text-gray-600">
                    See the latest auction results
                  </p>
                </div>
              </div>
              <Link
                to="/auctions?status=ended"
                className="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium"
              >
                View All
                <ArrowUpRight className="w-5 h-5 ml-1" />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {recentlyEndedAuctions.map((auction) => (
                <AuctionCard
                  key={auction._id}
                  auction={auction}
                  isEnded={true}
                />
              ))}
            </div>
          </div>
        )}

        {/* No Active Auctions */}
        {activeAuctions.length === 0 && (
          <div className="text-center py-16">
            <div className="text-gray-400 text-6xl mb-6">🎨</div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              No Active Auctions
            </h3>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">
              There are currently no active auctions. Check back soon for new
              items, or create your own auction!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/auctions" className="btn-primary">
                Browse All Auctions
              </Link>
              {user?.role === "Auctioneer" && (
                <Link to="/create-auction" className="btn-secondary">
                  Create Auction
                </Link>
              )}
            </div>
          </div>
        )}

        {/* User Stats for Authenticated Users */}
        {user && (
          <div className="card">
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Your Activity
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-3">
                    <DollarSign className="w-6 h-6 text-white" />
                  </div>
                  <p className="text-2xl font-bold text-blue-600">
                    ${user.moneySpent || 0}
                  </p>
                  <p className="text-sm text-gray-600">Total Spent</p>
                </div>

                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Trophy className="w-6 h-6 text-white" />
                  </div>
                  <p className="text-2xl font-bold text-green-600">
                    {user.auctionsWon || 0}
                  </p>
                  <p className="text-sm text-gray-600">Auctions Won</p>
                </div>

                <div className="text-center p-4 bg-purple-50 rounded-lg">
                  <div className="w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Star className="w-6 h-6 text-white" />
                  </div>
                  <p className="text-2xl font-bold text-purple-600">
                    {user.role === "Auctioneer"
                      ? user.unpaidCommission || 0
                      : "—"}
                  </p>
                  <p className="text-sm text-gray-600">
                    {user.role === "Auctioneer"
                      ? "Unpaid Commission"
                      : "Rating"}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
