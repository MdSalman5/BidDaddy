import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchAllAuctions } from "../store/slices/auctionSlice";
import AuctionCard from "../components/AuctionCard";
import LoadingSpinner from "../components/LoadingSpinner";
import FloatingThemeToggle from "../components/FloatingThemeToggle";
import FilterModal from "../components/FilterModal";
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
} from "lucide-react";

const AuctionList = () => {
  const dispatch = useDispatch();
  const { auctions, loading, error } = useSelector((state) => state.auction);

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedCondition, setSelectedCondition] = useState("all");
  const [priceRange, setPriceRange] = useState({ min: "", max: "" });
  const [sortBy, setSortBy] = useState("ending-soon");
  const [viewMode, setViewMode] = useState("grid");
  const [showFilters, setShowFilters] = useState(false);
  const [auctionStatus, setAuctionStatus] = useState("active");

  useEffect(() => {
    dispatch(fetchAllAuctions());
  }, [dispatch]);

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
    { value: "price-low", label: "Price: Low to High" },
    { value: "price-high", label: "Price: High to Low" },
    { value: "most-bids", label: "Most Bids" },
    { value: "alphabetical", label: "A to Z" },
  ];

  const filterAuctions = () => {
    let filtered = [...auctions];

    // Filter by status
    const now = new Date();
    if (auctionStatus === "active") {
      filtered = filtered.filter((auction) => new Date(auction.endTime) > now);
    } else if (auctionStatus === "ended") {
      filtered = filtered.filter((auction) => new Date(auction.endTime) <= now);
    } else if (auctionStatus === "upcoming") {
      filtered = filtered.filter(
        (auction) => new Date(auction.startTime) > now,
      );
    }

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(
        (auction) =>
          auction.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          auction.description.toLowerCase().includes(searchTerm.toLowerCase()),
      );
    }

    // Filter by category
    if (selectedCategory !== "all") {
      filtered = filtered.filter(
        (auction) => auction.category === selectedCategory,
      );
    }

    // Filter by condition
    if (selectedCondition !== "all") {
      filtered = filtered.filter(
        (auction) => auction.condition === selectedCondition,
      );
    }

    // Filter by price range
    if (priceRange.min || priceRange.max) {
      filtered = filtered.filter((auction) => {
        const currentBid = auction.currentBid || auction.startingBid;
        const min = priceRange.min ? parseFloat(priceRange.min) : 0;
        const max = priceRange.max ? parseFloat(priceRange.max) : Infinity;
        return currentBid >= min && currentBid <= max;
      });
    }

    // Sort auctions
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "ending-soon":
          return new Date(a.endTime) - new Date(b.endTime);
        case "newest":
          return (
            new Date(b.createdAt || b.startTime) -
            new Date(a.createdAt || a.startTime)
          );
        case "price-low":
          return (
            (a.currentBid || a.startingBid) - (b.currentBid || b.startingBid)
          );
        case "price-high":
          return (
            (b.currentBid || b.startingBid) - (a.currentBid || a.startingBid)
          );
        case "most-bids":
          return (b.bids?.length || 0) - (a.bids?.length || 0);
        case "alphabetical":
          return a.title.localeCompare(b.title);
        default:
          return 0;
      }
    });

    return filtered;
  };

  const filteredAuctions = filterAuctions();

  const clearFilters = () => {
    setSearchTerm("");
    setSelectedCategory("all");
    setSelectedCondition("all");
    setPriceRange({ min: "", max: "" });
    setSortBy("ending-soon");
    setAuctionStatus("active");
  };

  const getActiveFilterCount = () => {
    let count = 0;
    if (searchTerm) count++;
    if (selectedCategory !== "all") count++;
    if (selectedCondition !== "all") count++;
    if (priceRange.min || priceRange.max) count++;
    if (auctionStatus !== "active") count++;
    return count;
  };

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
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      <FloatingThemeToggle position="top-right" variant="modern" />

      {/* Header */}
      <div className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div className="mb-4 md:mb-0">
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-gray-100">
                Discover Auctions
              </h1>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                {filteredAuctions.length} of {auctions.length} auctions
              </p>
            </div>

            {/* Status Tabs */}
            <div className="mt-4 md:mt-0">
              <div className="flex space-x-1 bg-gray-100 rounded-lg p-1">
                {[
                  {
                    key: "active",
                    label: "Active",
                    count: auctions.filter(
                      (a) => new Date(a.endTime) > new Date(),
                    ).length,
                  },
                  {
                    key: "ended",
                    label: "Ended",
                    count: auctions.filter(
                      (a) => new Date(a.endTime) <= new Date(),
                    ).length,
                  },
                  {
                    key: "upcoming",
                    label: "Upcoming",
                    count: auctions.filter(
                      (a) => new Date(a.startTime) > new Date(),
                    ).length,
                  },
                ].map((status) => (
                  <button
                    key={status.key}
                    onClick={() => setAuctionStatus(status.key)}
                    className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                      auctionStatus === status.key
                        ? "bg-white text-blue-600 shadow-sm"
                        : "text-gray-600 hover:text-gray-900"
                    }`}
                  >
                    {status.label} ({status.count})
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar */}
          <div
            className={`lg:w-80 ${showFilters ? "block" : "hidden lg:block"}`}
          >
            <div className="card sticky top-8">
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-gray-900">
                    Filters
                  </h3>
                  <div className="flex items-center space-x-2">
                    {getActiveFilterCount() > 0 && (
                      <button
                        onClick={clearFilters}
                        className="text-sm text-blue-600 hover:text-blue-800"
                      >
                        Clear All
                      </button>
                    )}
                    <button
                      onClick={() => setShowFilters(false)}
                      className="lg:hidden text-gray-400 hover:text-gray-600"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                </div>

                <div className="space-y-6">
                  {/* Search */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Search
                    </label>
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                      <input
                        type="text"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="input-field pl-10"
                        placeholder="Search auctions..."
                      />
                    </div>
                  </div>

                  {/* Category */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Category
                    </label>
                    <select
                      value={selectedCategory}
                      onChange={(e) => setSelectedCategory(e.target.value)}
                      className="input-field"
                    >
                      <option value="all">All Categories</option>
                      {categories.map((category) => (
                        <option key={category} value={category}>
                          {category}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Condition */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Condition
                    </label>
                    <select
                      value={selectedCondition}
                      onChange={(e) => setSelectedCondition(e.target.value)}
                      className="input-field"
                    >
                      <option value="all">All Conditions</option>
                      {conditions.map((condition) => (
                        <option key={condition} value={condition}>
                          {condition}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Price Range */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Price Range
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      <input
                        type="number"
                        value={priceRange.min}
                        onChange={(e) =>
                          setPriceRange({ ...priceRange, min: e.target.value })
                        }
                        className="input-field"
                        placeholder="Min"
                      />
                      <input
                        type="number"
                        value={priceRange.max}
                        onChange={(e) =>
                          setPriceRange({ ...priceRange, max: e.target.value })
                        }
                        className="input-field"
                        placeholder="Max"
                      />
                    </div>
                  </div>

                  {/* Quick Price Filters */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Quick Filters
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      {[
                        { label: "Under $100", max: 100 },
                        { label: "$100-$500", min: 100, max: 500 },
                        { label: "$500-$1000", min: 500, max: 1000 },
                        { label: "Over $1000", min: 1000 },
                      ].map((filter) => (
                        <button
                          key={filter.label}
                          onClick={() =>
                            setPriceRange({
                              min: filter.min?.toString() || "",
                              max: filter.max?.toString() || "",
                            })
                          }
                          className="text-xs py-2 px-3 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors text-gray-700"
                        >
                          {filter.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {/* Top Bar */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
              <div className="flex items-center space-x-4 mb-4 sm:mb-0">
                <button
                  onClick={() => setShowFilters(true)}
                  className="lg:hidden flex items-center space-x-2 px-4 py-2 bg-gray-100 rounded-lg text-gray-700 hover:bg-gray-200 transition-colors"
                >
                  <SlidersHorizontal className="w-5 h-5" />
                  <span>Filters</span>
                  {getActiveFilterCount() > 0 && (
                    <span className="bg-blue-500 text-white text-xs rounded-full px-2 py-1">
                      {getActiveFilterCount()}
                    </span>
                  )}
                </button>

                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-600">Sort by:</span>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="input-field text-sm py-2"
                  >
                    {sortOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-600">View:</span>
                <div className="flex border border-gray-300 rounded-lg">
                  <button
                    onClick={() => setViewMode("grid")}
                    className={`p-2 ${
                      viewMode === "grid"
                        ? "bg-blue-600 text-white"
                        : "text-gray-600 hover:text-gray-900"
                    }`}
                  >
                    <Grid3X3 className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => setViewMode("list")}
                    className={`p-2 ${
                      viewMode === "list"
                        ? "bg-blue-600 text-white"
                        : "text-gray-600 hover:text-gray-900"
                    }`}
                  >
                    <List className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>

            {/* Results */}
            {filteredAuctions.length > 0 ? (
              <div
                className={
                  viewMode === "grid"
                    ? "grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6"
                    : "space-y-6"
                }
              >
                {filteredAuctions.map((auction) => (
                  <AuctionCard
                    key={auction._id}
                    auction={auction}
                    isEnded={new Date(auction.endTime) <= new Date()}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <div className="text-gray-400 text-6xl mb-6">🔍</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  No auctions found
                </h3>
                <p className="text-gray-600 mb-6">
                  Try adjusting your filters or search terms to find more
                  auctions.
                </p>
                <button onClick={clearFilters} className="btn-primary">
                  Clear All Filters
                </button>
              </div>
            )}

            {/* Load More */}
            {filteredAuctions.length > 0 && filteredAuctions.length >= 20 && (
              <div className="mt-12 text-center">
                <button className="btn-secondary">Load More Auctions</button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuctionList;
