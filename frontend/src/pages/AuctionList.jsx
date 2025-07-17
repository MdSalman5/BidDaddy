import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { auctionService } from "../services";
import AuctionCard from "../components/AuctionCard";
import LoadingSpinner from "../components/LoadingSpinner";
import FloatingThemeToggle from "../components/FloatingThemeToggle";
import FilterModal from "../components/FilterModal";
import { toast } from "react-toastify";
import {
  Search,
  Filter,
  Grid3X3,
  List,
  SlidersHorizontal,
  Calendar,
  DollarSign,
  Package,
  Clock,
  TrendingUp,
  X,
  RefreshCw,
} from "lucide-react";

const AuctionList = () => {
  const { isAuthenticated } = useSelector((state) => state.auth);

  // State management
  const [auctions, setAuctions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedCondition, setSelectedCondition] = useState("all");
  const [priceRange, setPriceRange] = useState({ min: "", max: "" });
  const [sortBy, setSortBy] = useState("ending-soon");
  const [viewMode, setViewMode] = useState("grid");
  const [showFilters, setShowFilters] = useState(false);
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [auctionStatus, setAuctionStatus] = useState("active");
  const [refreshing, setRefreshing] = useState(false);

  // Load auctions
  const loadAuctions = async (showLoader = true) => {
    try {
      if (showLoader) setLoading(true);
      setError(null);

      const response = await auctionService.getAllAuctions();

      if (response?.items) {
        setAuctions(response.items);
      } else if (Array.isArray(response)) {
        setAuctions(response);
      } else {
        setAuctions([]);
      }

      console.log(`✅ Loaded ${auctions.length} auctions`);
    } catch (error) {
      console.error("❌ Failed to load auctions:", error);
      setError(error.message || "Failed to load auctions");
      toast.error("Failed to load auctions. Please try again.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // Refresh auctions
  const handleRefresh = async () => {
    setRefreshing(true);
    await loadAuctions(false);
    toast.success("Auctions refreshed!");
  };

  // Initial load
  useEffect(() => {
    loadAuctions();
  }, []);

  const categories = [
    "Electronics",
    "Art & Collectibles",
    "Jewelry & Watches",
    "Vehicles",
    "Fashion",
    "Sports & Recreation",
    "Home & Garden",
    "Books & Media",
    "Antiques",
    "Other",
  ];

  const conditions = ["New", "Like New", "Good", "Fair", "Poor"];

  const sortOptions = [
    { value: "ending-soon", label: "Ending Soon" },
    { value: "newest", label: "Newest First" },
    { value: "oldest", label: "Oldest First" },
    { value: "price-low", label: "Price: Low to High" },
    { value: "price-high", label: "Price: High to Low" },
    { value: "most-bids", label: "Most Bids" },
    { value: "alphabetical", label: "A-Z" },
  ];

  // Filter and sort auctions
  const filteredAuctions = auctions.filter((auction) => {
    // Search filter
    if (
      searchTerm &&
      !auction.title?.toLowerCase().includes(searchTerm.toLowerCase()) &&
      !auction.description?.toLowerCase().includes(searchTerm.toLowerCase()) &&
      !auction.category?.toLowerCase().includes(searchTerm.toLowerCase())
    ) {
      return false;
    }

    // Category filter
    if (selectedCategory !== "all" && auction.category !== selectedCategory) {
      return false;
    }

    // Condition filter
    if (
      selectedCondition !== "all" &&
      auction.condition !== selectedCondition
    ) {
      return false;
    }

    // Price range filter
    if (priceRange.min && auction.currentBid < parseFloat(priceRange.min)) {
      return false;
    }
    if (priceRange.max && auction.currentBid > parseFloat(priceRange.max)) {
      return false;
    }

    // Status filter
    const now = new Date();
    const endTime = new Date(auction.endTime);
    const isActive = endTime > now;
    const isEnded = endTime <= now;

    if (auctionStatus === "active" && !isActive) return false;
    if (auctionStatus === "ended" && !isEnded) return false;

    return true;
  });

  // Sort auctions
  const sortedAuctions = [...filteredAuctions].sort((a, b) => {
    switch (sortBy) {
      case "ending-soon":
        return new Date(a.endTime) - new Date(b.endTime);
      case "newest":
        return new Date(b.createdAt) - new Date(a.createdAt);
      case "oldest":
        return new Date(a.createdAt) - new Date(b.createdAt);
      case "price-low":
        return a.currentBid - b.currentBid;
      case "price-high":
        return b.currentBid - a.currentBid;
      case "most-bids":
        return (b.bidCount || 0) - (a.bidCount || 0);
      case "alphabetical":
        return a.title?.localeCompare(b.title) || 0;
      default:
        return 0;
    }
  });

  // Get active filter count
  const getActiveFilterCount = () => {
    let count = 0;
    if (searchTerm) count++;
    if (selectedCategory !== "all") count++;
    if (selectedCondition !== "all") count++;
    if (priceRange.min || priceRange.max) count++;
    if (sortBy !== "ending-soon") count++;
    return count;
  };

  // Clear all filters
  const clearFilters = () => {
    setSearchTerm("");
    setSelectedCategory("all");
    setSelectedCondition("all");
    setPriceRange({ min: "", max: "" });
    setSortBy("ending-soon");
    setAuctionStatus("active");
    toast.success("Filters cleared!");
  };

  if (loading) {
    return <LoadingSpinner fullScreen text="Loading auctions..." />;
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-6">
          <h2 className="text-2xl font-bold text-red-600 dark:text-red-400 mb-4">
            Error Loading Auctions
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">{error}</p>
          <button
            onClick={() => loadAuctions()}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                Browse Auctions
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-1">
                Discover unique items and place your bids
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={handleRefresh}
                disabled={refreshing}
                className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors disabled:opacity-50"
              >
                <RefreshCw
                  className={`w-4 h-4 ${refreshing ? "animate-spin" : ""}`}
                />
                Refresh
              </button>
            </div>
          </div>
        </div>

        {/* Status Tabs */}
        <div className="mb-6">
          <div className="flex space-x-1 bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
            {[
              { key: "active", label: "Active Auctions" },
              { key: "ended", label: "Ended Auctions" },
              { key: "upcoming", label: "Upcoming" },
            ].map((status) => (
              <button
                key={status.key}
                onClick={() => setAuctionStatus(status.key)}
                className={`flex-1 px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                  auctionStatus === status.key
                    ? "bg-white dark:bg-gray-700 text-blue-600 dark:text-blue-400 shadow-sm"
                    : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200"
                }`}
              >
                {status.label}
              </button>
            ))}
          </div>
        </div>

        {/* Search and Filter Bar */}
        <div className="mb-6 space-y-4">
          {/* Search and Quick Actions */}
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search auctions..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Filter Toggle */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center gap-2 px-4 py-3 rounded-lg font-medium transition-colors ${
                showFilters || getActiveFilterCount() > 0
                  ? "bg-blue-600 text-white shadow-lg"
                  : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700"
              }`}
            >
              <SlidersHorizontal className="w-5 h-5" />
              {showFilters ? "Hide Filters" : "Show Filters"}
              {getActiveFilterCount() > 0 && (
                <span className="ml-2 px-2 py-1 bg-blue-500 text-white text-xs rounded-full">
                  {getActiveFilterCount()}
                </span>
              )}
            </button>

            {/* Clear Filters */}
            {getActiveFilterCount() > 0 && (
              <button
                onClick={clearFilters}
                className="flex items-center gap-2 px-4 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                <X className="w-5 h-5" />
                Clear
              </button>
            )}

            {/* View Mode Toggle */}
            <div className="flex bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
              <button
                onClick={() => setViewMode("grid")}
                className={`p-2 rounded-md transition-colors ${
                  viewMode === "grid"
                    ? "bg-white dark:bg-gray-700 text-blue-600 dark:text-blue-400 shadow-sm"
                    : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200"
                }`}
              >
                <Grid3X3 className="w-5 h-5" />
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`p-2 rounded-md transition-colors ${
                  viewMode === "list"
                    ? "bg-white dark:bg-gray-700 text-blue-600 dark:text-blue-400 shadow-sm"
                    : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200"
                }`}
              >
                <List className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Collapsible Filter Panel */}
          {showFilters && (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 transition-all duration-300">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {/* Category Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Category
                  </label>
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="all">All Categories</option>
                    {categories.map((category) => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Condition Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Condition
                  </label>
                  <select
                    value={selectedCondition}
                    onChange={(e) => setSelectedCondition(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="all">Any Condition</option>
                    {conditions.map((condition) => (
                      <option key={condition} value={condition}>
                        {condition}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Price Range */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Price Range
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="number"
                      placeholder="Min"
                      value={priceRange.min}
                      onChange={(e) =>
                        setPriceRange({ ...priceRange, min: e.target.value })
                      }
                      className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    <input
                      type="number"
                      placeholder="Max"
                      value={priceRange.max}
                      onChange={(e) =>
                        setPriceRange({ ...priceRange, max: e.target.value })
                      }
                      className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>

                {/* Sort */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Sort By
                  </label>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    {sortOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Results Summary */}
        <div className="mb-6 flex items-center justify-between">
          <p className="text-gray-600 dark:text-gray-400">
            Showing {sortedAuctions.length} of {auctions.length} auctions
          </p>

          {sortedAuctions.length === 0 && auctions.length > 0 && (
            <div className="text-center">
              <p className="text-gray-500 dark:text-gray-400 mb-4">
                No auctions match your current filters
              </p>
              <button
                onClick={clearFilters}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Clear Filters
              </button>
            </div>
          )}
        </div>

        {/* Auction Grid/List */}
        {sortedAuctions.length > 0 ? (
          <div
            className={
              viewMode === "grid"
                ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                : "space-y-4"
            }
          >
            {sortedAuctions.map((auction) => (
              <AuctionCard
                key={auction._id || auction.id}
                auction={auction}
                viewMode={viewMode}
              />
            ))}
          </div>
        ) : auctions.length === 0 ? (
          <div className="text-center py-12">
            <Package className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              No auctions available
            </h3>
            <p className="text-gray-500 dark:text-gray-400 mb-6">
              Check back later for new auction listings.
            </p>
            <button
              onClick={() => loadAuctions()}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Refresh
            </button>
          </div>
        ) : null}
      </div>

      {/* Filter Modal for Mobile */}
      <FilterModal
        isOpen={showFilterModal}
        onClose={() => setShowFilterModal(false)}
        filters={{
          searchTerm,
          selectedCategory,
          selectedCondition,
          priceRange,
          sortBy,
        }}
        onFiltersChange={(newFilters) => {
          setSearchTerm(newFilters.searchTerm);
          setSelectedCategory(newFilters.selectedCategory);
          setSelectedCondition(newFilters.selectedCondition);
          setPriceRange(newFilters.priceRange);
          setSortBy(newFilters.sortBy);
        }}
        categories={categories}
        conditions={conditions}
        sortOptions={sortOptions}
      />

      <FloatingThemeToggle />
    </div>
  );
};

export default AuctionList;
