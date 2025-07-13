import React, { useState, useEffect } from "react";
import { authService } from "../services/authService";
import { toast } from "react-toastify";
import {
  Trophy,
  Medal,
  Award,
  TrendingUp,
  DollarSign,
  Gavel,
  User,
  Crown,
  Star,
  Target,
  Zap,
  Calendar,
  Filter,
  Search,
} from "lucide-react";
import FloatingThemeToggle from "../components/FloatingThemeToggle";

const Leaderboard = () => {
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);
  const [timeframe, setTimeframe] = useState("all"); // all, month, week
  const [category, setCategory] = useState("spending"); // spending, wins, bids
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchLeaderboard();
  }, [timeframe, category]);

  const fetchLeaderboard = async () => {
    setLoading(true);
    try {
      const response = await authService.getLeaderboard();
      if (response.success) {
        setLeaderboard(response.leaderboard || []);
      } else {
        throw new Error(response.message || "Failed to fetch leaderboard");
      }
    } catch (error) {
      console.error("Fetch leaderboard error:", error);
      toast.error(error.message || "Failed to fetch leaderboard");
    } finally {
      setLoading(false);
    }
  };

  const getRankIcon = (rank) => {
    switch (rank) {
      case 1:
        return <Crown className="w-6 h-6 text-yellow-500" />;
      case 2:
        return <Medal className="w-6 h-6 text-gray-400" />;
      case 3:
        return <Award className="w-6 h-6 text-amber-600" />;
      default:
        return (
          <div className="w-6 h-6 flex items-center justify-center bg-gray-200 dark:bg-gray-700 rounded-full text-sm font-semibold text-gray-600 dark:text-gray-400">
            {rank}
          </div>
        );
    }
  };

  const getRankBadge = (rank) => {
    switch (rank) {
      case 1:
        return "bg-gradient-to-r from-yellow-400 to-yellow-600 text-white";
      case 2:
        return "bg-gradient-to-r from-gray-300 to-gray-500 text-white";
      case 3:
        return "bg-gradient-to-r from-amber-400 to-amber-600 text-white";
      default:
        return "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300";
    }
  };

  const filteredLeaderboard = (leaderboard || []).filter((user) => {
    if (!user) return false;
    const userName = (user.name || "").toLowerCase();
    const userEmail = (user.email || "").toLowerCase();
    const search = (searchTerm || "").toLowerCase();
    return userName.includes(search) || userEmail.includes(search);
  });

  const categories = [
    {
      id: "spending",
      label: "Top Spenders",
      icon: DollarSign,
      description: "Users who have spent the most on auctions",
      getValue: (user) => `$${user.moneySpent?.toLocaleString() || 0}`,
    },
    {
      id: "wins",
      label: "Most Wins",
      icon: Trophy,
      description: "Users with the highest number of auction wins",
      getValue: (user) => `${user.auctionsWon || 0} wins`,
    },
    {
      id: "bids",
      label: "Most Active",
      icon: Gavel,
      description: "Users with the highest bidding activity",
      getValue: (user) => `${user.totalBids || 0} bids`,
    },
  ];

  const currentCategory = categories.find((cat) => cat.id === category);

  const safeLeaderboard = leaderboard || [];

  const stats = [
    {
      label: "Total Users",
      value: safeLeaderboard.length,
      icon: User,
      color: "blue",
    },
    {
      label: "Total Spent",
      value: `$${safeLeaderboard.reduce((sum, user) => sum + ((user && user.moneySpent) || 0), 0).toLocaleString()}`,
      icon: DollarSign,
      color: "green",
    },
    {
      label: "Total Auctions Won",
      value: safeLeaderboard.reduce(
        (sum, user) => sum + ((user && user.auctionsWon) || 0),
        0,
      ),
      icon: Trophy,
      color: "yellow",
    },
    {
      label: "Average Spend",
      value: `$${Math.round(safeLeaderboard.reduce((sum, user) => sum + ((user && user.moneySpent) || 0), 0) / Math.max(safeLeaderboard.length, 1)).toLocaleString()}`,
      icon: TrendingUp,
      color: "purple",
    },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">
            Loading leaderboard...
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
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <div className="p-4 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-2xl shadow-lg">
              <Trophy className="w-8 h-8 text-white" />
            </div>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-gray-100 mb-4">
            Leaderboard
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Discover the top performers in our auction community and see where
            you rank among fellow bidders.
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div
                key={index}
                className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-shadow"
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

        {/* Controls */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-6 mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
            {/* Category Tabs */}
            <div className="flex flex-wrap gap-2">
              {categories.map((cat) => {
                const Icon = cat.icon;
                return (
                  <button
                    key={cat.id}
                    onClick={() => setCategory(cat.id)}
                    className={`inline-flex items-center px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                      category === cat.id
                        ? "bg-blue-600 text-white shadow-md"
                        : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
                    }`}
                  >
                    <Icon className="w-4 h-4 mr-2" />
                    {cat.label}
                  </button>
                );
              })}
            </div>

            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search users..."
                className="w-full lg:w-64 pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              />
            </div>
          </div>

          {/* Category Description */}
          <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
            <div className="flex items-center space-x-2">
              <currentCategory.icon className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {currentCategory.description}
              </p>
            </div>
          </div>
        </div>

        {/* Leaderboard */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
          {/* Top 3 Podium */}
          {filteredLeaderboard && filteredLeaderboard.length >= 3 && (
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-gray-700 dark:to-gray-600 p-8">
              <div className="max-w-4xl mx-auto">
                <div className="flex items-end justify-center space-x-8">
                  {/* 2nd Place */}
                  <div className="text-center">
                    <div className="bg-gray-300 rounded-2xl p-6 mb-4 relative">
                      <div className="w-16 h-16 bg-white dark:bg-gray-700 rounded-full mx-auto mb-4 flex items-center justify-center">
                        <User className="w-8 h-8 text-gray-400" />
                      </div>
                      <div className="absolute -top-2 left-1/2 transform -translate-x-1/2">
                        <Medal className="w-8 h-8 text-gray-400" />
                      </div>
                    </div>
                    <h3 className="font-semibold text-gray-900 dark:text-gray-100">
                      {filteredLeaderboard[1]?.name}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {currentCategory.getValue(filteredLeaderboard[1])}
                    </p>
                  </div>

                  {/* 1st Place */}
                  <div className="text-center">
                    <div className="bg-gradient-to-b from-yellow-400 to-yellow-600 rounded-2xl p-6 mb-4 relative transform scale-110">
                      <div className="w-20 h-20 bg-white dark:bg-gray-700 rounded-full mx-auto mb-4 flex items-center justify-center">
                        <User className="w-10 h-10 text-gray-400" />
                      </div>
                      <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                        <Crown className="w-10 h-10 text-yellow-200" />
                      </div>
                    </div>
                    <h3 className="font-bold text-gray-900 dark:text-gray-100 text-lg">
                      {filteredLeaderboard[0]?.name}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400">
                      {currentCategory.getValue(filteredLeaderboard[0])}
                    </p>
                  </div>

                  {/* 3rd Place */}
                  <div className="text-center">
                    <div className="bg-amber-500 rounded-2xl p-6 mb-4 relative">
                      <div className="w-16 h-16 bg-white dark:bg-gray-700 rounded-full mx-auto mb-4 flex items-center justify-center">
                        <User className="w-8 h-8 text-gray-400" />
                      </div>
                      <div className="absolute -top-2 left-1/2 transform -translate-x-1/2">
                        <Award className="w-8 h-8 text-amber-200" />
                      </div>
                    </div>
                    <h3 className="font-semibold text-gray-900 dark:text-gray-100">
                      {filteredLeaderboard[2]?.name}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {currentCategory.getValue(filteredLeaderboard[2])}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Full Leaderboard Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Rank
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    User
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    {currentCategory.label}
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Role
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Auctions Won
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {filteredLeaderboard.map((user, index) => (
                  <tr
                    key={user._id}
                    className={`hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors ${
                      index < 3
                        ? "bg-gradient-to-r from-yellow-50/30 to-orange-50/30 dark:from-yellow-900/10 dark:to-orange-900/10"
                        : ""
                    }`}
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div
                        className={`inline-flex items-center justify-center w-10 h-10 rounded-full ${getRankBadge(user.rank)}`}
                      >
                        {getRankIcon(user.rank)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mr-4">
                          <User className="w-6 h-6 text-gray-400" />
                        </div>
                        <div>
                          <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                            {user.name}
                          </div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">
                            {user.email}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                        {currentCategory.getValue(user)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          user.role === "Auctioneer"
                            ? "bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-300"
                            : "bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300"
                        }`}
                      >
                        {user.role || "Bidder"}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                      <div className="flex items-center">
                        <Trophy className="w-4 h-4 mr-2 text-yellow-500" />
                        {user.auctionsWon || 0}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredLeaderboard.length === 0 && (
            <div className="text-center py-12">
              <Trophy className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
                No users found
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                {searchTerm
                  ? "Try adjusting your search terms."
                  : "The leaderboard is empty."}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Leaderboard;
