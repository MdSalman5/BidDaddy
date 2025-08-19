import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { auctionService } from "../services";
import { 
  Gavel, 
  TrendingUp, 
  Shield, 
  Zap, 
  ArrowRight, 
  Star,
  Users,
  Trophy,
  Clock,
  Search,
  ChevronRight
} from "lucide-react";
import AuctionCard from "../components/AuctionCard";
import LoadingSpinner from "../components/LoadingSpinner";

const Home = () => {
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const [featuredAuctions, setFeaturedAuctions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalAuctions: 0,
    activeUsers: 0,
    totalSales: 0
  });

  useEffect(() => {
    loadFeaturedAuctions();
    loadStats();
  }, []);

  const loadFeaturedAuctions = async () => {
    try {
      const response = await auctionService.getAllAuctions();
      const auctions = response?.items || response || [];
      
      // Get featured auctions (limit to 6 for display)
      const featured = auctions
        .filter(auction => new Date(auction.endTime) > new Date())
        .sort((a, b) => (b.bidCount || 0) - (a.bidCount || 0))
        .slice(0, 6);
      
      setFeaturedAuctions(featured);
    } catch (error) {
      console.error("Failed to load featured auctions:", error);
    } finally {
      setLoading(false);
    }
  };

  const loadStats = () => {
    // Mock stats - in real app these would come from API
    setStats({
      totalAuctions: 1200,
      activeUsers: 5400,
      totalSales: 2800000
    });
  };

  const features = [
    {
      icon: Gavel,
      title: "Live Auctions",
      description: "Participate in real-time bidding with instant updates",
      color: "blue"
    },
    {
      icon: Shield,
      title: "Secure Bidding",
      description: "Bank-level security with verified users and payments",
      color: "green"
    },
    {
      icon: TrendingUp,
      title: "Market Insights",
      description: "Track trends and make informed bidding decisions",
      color: "purple"
    },
    {
      icon: Zap,
      title: "Instant Notifications",
      description: "Real-time alerts for bids, wins, and auction updates",
      color: "yellow"
    }
  ];

  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "Art Collector",
      content: "BidDaddy has transformed how I discover unique pieces. The platform is secure and user-friendly!",
      rating: 5,
      avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b1c5?w=60&h=60&fit=crop&crop=face"
    },
    {
      name: "Michael Chen",
      role: "Antique Dealer",
      content: "As an auctioneer, I love the comprehensive tools and the vibrant community of bidders.",
      rating: 5,
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=60&h=60&fit=crop&crop=face"
    },
    {
      name: "Emma Davis",
      role: "Vintage Enthusiast", 
      content: "The variety of items and the bidding experience is fantastic. I've found amazing treasures here!",
      rating: 5,
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=60&h=60&fit=crop&crop=face"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-600 via-purple-600 to-blue-800 text-white overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-20 w-32 h-32 bg-white rounded-full animate-pulse"></div>
          <div className="absolute bottom-20 right-20 w-24 h-24 bg-white rounded-full animate-pulse delay-700"></div>
          <div className="absolute top-1/2 right-10 w-16 h-16 bg-white rounded-full animate-pulse delay-1000"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-32">
          <div className="text-center">
            <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold mb-6">
              Welcome to{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-500">
                BidDaddy
              </span>
            </h1>
            <p className="text-xl sm:text-2xl lg:text-3xl mb-8 max-w-4xl mx-auto text-blue-100">
              The premier auction platform where collectors, dealers, and enthusiasts 
              discover extraordinary items and build lasting connections.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              {!isAuthenticated ? (
                <>
                  <Link
                    to="/register"
                    className="inline-flex items-center px-8 py-4 bg-white text-blue-600 font-semibold rounded-xl hover:bg-gray-100 transition-all duration-300 transform hover:scale-105 shadow-lg"
                  >
                    Get Started Free
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </Link>
                  <Link
                    to="/auctions"
                    className="inline-flex items-center px-8 py-4 border-2 border-white text-white font-semibold rounded-xl hover:bg-white hover:text-blue-600 transition-all duration-300"
                  >
                    Browse Auctions
                    <Search className="ml-2 w-5 h-5" />
                  </Link>
                </>
              ) : (
                <>
                  <Link
                    to="/dashboard"
                    className="inline-flex items-center px-8 py-4 bg-white text-blue-600 font-semibold rounded-xl hover:bg-gray-100 transition-all duration-300 transform hover:scale-105 shadow-lg"
                  >
                    Go to Dashboard
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </Link>
                  <Link
                    to="/auctions"
                    className="inline-flex items-center px-8 py-4 border-2 border-white text-white font-semibold rounded-xl hover:bg-white hover:text-blue-600 transition-all duration-300"
                  >
                    Browse Auctions
                    <Search className="ml-2 w-5 h-5" />
                  </Link>
                </>
              )}
            </div>

            {isAuthenticated && user && (
              <div className="mt-8 p-6 bg-white/10 backdrop-blur-sm rounded-2xl max-w-md mx-auto">
                <p className="text-lg font-medium">Welcome back, {user.userName}!</p>
                <p className="text-blue-200">Ready to discover your next treasure?</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="text-4xl sm:text-5xl font-bold text-blue-600 dark:text-blue-400 mb-2">
                {stats.totalAuctions.toLocaleString()}+
              </div>
              <div className="text-gray-600 dark:text-gray-400 font-medium">Active Auctions</div>
            </div>
            <div className="text-center">
              <div className="text-4xl sm:text-5xl font-bold text-purple-600 dark:text-purple-400 mb-2">
                {stats.activeUsers.toLocaleString()}+
              </div>
              <div className="text-gray-600 dark:text-gray-400 font-medium">Happy Users</div>
            </div>
            <div className="text-center">
              <div className="text-4xl sm:text-5xl font-bold text-green-600 dark:text-green-400 mb-2">
                ${(stats.totalSales / 1000000).toFixed(1)}M+
              </div>
              <div className="text-gray-600 dark:text-gray-400 font-medium">Total Sales</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Why Choose BidDaddy?
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
              Experience the future of online auctions with our cutting-edge platform
              designed for both beginners and seasoned collectors.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div
                  key={index}
                  className="group bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2"
                >
                  <div className={`w-16 h-16 bg-${feature.color}-100 dark:bg-${feature.color}-900/30 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                    <Icon className={`w-8 h-8 text-${feature.color}-600 dark:text-${feature.color}-400`} />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    {feature.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Featured Auctions Section */}
      <section className="py-20 bg-white dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-12">
            <div>
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                Featured Auctions
              </h2>
              <p className="text-xl text-gray-600 dark:text-gray-400">
                Discover trending items and hot bidding action
              </p>
            </div>
            <Link
              to="/auctions"
              className="hidden sm:inline-flex items-center px-6 py-3 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition-colors"
            >
              View All
              <ChevronRight className="ml-2 w-5 h-5" />
            </Link>
          </div>

          {loading ? (
            <div className="flex justify-center py-12">
              <LoadingSpinner size="lg" text="Loading featured auctions..." />
            </div>
          ) : featuredAuctions.length > 0 ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {featuredAuctions.map((auction) => (
                  <AuctionCard
                    key={auction._id || auction.id}
                    auction={auction}
                    viewMode="grid"
                  />
                ))}
              </div>
              <div className="text-center mt-12">
                <Link
                  to="/auctions"
                  className="inline-flex items-center px-8 py-4 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition-colors"
                >
                  Explore All Auctions
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Link>
              </div>
            </>
          ) : (
            <div className="text-center py-12">
              <Gavel className="mx-auto h-16 w-16 text-gray-400 mb-4" />
              <h3 className="text-xl font-medium text-gray-900 dark:text-white mb-2">
                No featured auctions right now
              </h3>
              <p className="text-gray-500 dark:text-gray-400 mb-6">
                Check back soon for exciting new listings!
              </p>
              <Link
                to="/auctions"
                className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
              >
                Browse All Auctions
                <ArrowRight className="ml-2 w-5 h-5" />
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              What Our Users Say
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400">
              Join thousands of satisfied collectors and auctioneers
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div
                key={index}
                className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg"
              >
                <div className="flex items-center mb-6">
                  <img
                    src={testimonial.avatar}
                    alt={testimonial.name}
                    className="w-12 h-12 rounded-full object-cover mr-4"
                  />
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white">
                      {testimonial.name}
                    </h4>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {testimonial.role}
                    </p>
                  </div>
                </div>
                
                <div className="flex mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                
                <p className="text-gray-600 dark:text-gray-400 italic">
                  "{testimonial.content}"
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl sm:text-4xl font-bold mb-6">
            Ready to Start Your Auction Journey?
          </h2>
          <p className="text-xl mb-8 text-blue-100">
            Join thousands of collectors and discover amazing items today.
          </p>
          
          {!isAuthenticated ? (
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/register"
                className="inline-flex items-center px-8 py-4 bg-white text-blue-600 font-semibold rounded-xl hover:bg-gray-100 transition-all duration-300 transform hover:scale-105"
              >
                Sign Up Free
                <ArrowRight className="ml-2 w-5 h-5" />
              </Link>
              <Link
                to="/login"
                className="inline-flex items-center px-8 py-4 border-2 border-white text-white font-semibold rounded-xl hover:bg-white hover:text-blue-600 transition-all duration-300"
              >
                Sign In
              </Link>
            </div>
          ) : (
            <Link
              to="/create-auction"
              className="inline-flex items-center px-8 py-4 bg-white text-blue-600 font-semibold rounded-xl hover:bg-gray-100 transition-all duration-300 transform hover:scale-105"
            >
              Create Your First Auction
              <ArrowRight className="ml-2 w-5 h-5" />
            </Link>
          )}
        </div>
      </section>
    </div>
  );
};

export default Home;
