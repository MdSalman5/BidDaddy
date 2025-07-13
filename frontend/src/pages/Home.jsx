import React from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { Gavel, TrendingUp, Shield, Zap } from "lucide-react";

const Home = () => {
  const { isAuthenticated } = useSelector((state) => state.auth);

  const features = [
    {
      icon: Gavel,
      title: "Live Auctions",
      description: "Participate in real-time bidding for amazing items",
    },
    {
      icon: TrendingUp,
      title: "Leaderboards",
      description: "Track top bidders and see auction statistics",
    },
    {
      icon: Shield,
      title: "Secure Bidding",
      description: "Safe and secure transactions with verified users",
    },
    {
      icon: Zap,
      title: "Instant Updates",
      description: "Real-time bid updates and notifications",
    },
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors duration-300">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-700 dark:from-blue-800 dark:to-purple-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
          <div className="text-center">
            <h1 className="text-3xl sm:text-4xl md:text-6xl font-bold mb-4 sm:mb-6">
              Welcome to{" "}
              <span className="text-yellow-300 dark:text-yellow-400">
                BidDaddy
              </span>
            </h1>
            <p className="text-lg sm:text-xl md:text-2xl mb-6 sm:mb-8 max-w-3xl mx-auto px-4">
              The ultimate auction platform where you can bid on amazing items,
              create your own auctions, and join a vibrant community of
              collectors.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 sm:space-x-4 justify-center items-center">
              {isAuthenticated ? (
                <Link
                  to="/dashboard"
                  className="inline-block bg-yellow-400 dark:bg-yellow-500 text-gray-900 dark:text-gray-800 px-6 sm:px-8 py-3 rounded-lg font-semibold text-base sm:text-lg hover:bg-yellow-300 dark:hover:bg-yellow-400 transition-all duration-300 hover:scale-105 active:scale-95 min-w-[160px] text-center"
                >
                  Go to Dashboard
                </Link>
              ) : (
                <>
                  <Link
                    to="/register"
                    className="inline-block bg-yellow-400 dark:bg-yellow-500 text-gray-900 dark:text-gray-800 px-6 sm:px-8 py-3 rounded-lg font-semibold text-base sm:text-lg hover:bg-yellow-300 dark:hover:bg-yellow-400 transition-all duration-300 hover:scale-105 active:scale-95 min-w-[160px] text-center"
                  >
                    Get Started
                  </Link>
                  <Link
                    to="/login"
                    className="inline-block border-2 border-white dark:border-gray-300 text-white dark:text-gray-100 px-6 sm:px-8 py-3 rounded-lg font-semibold text-base sm:text-lg hover:bg-white dark:hover:bg-gray-100 hover:text-gray-900 dark:hover:text-gray-800 transition-all duration-300 hover:scale-105 active:scale-95 min-w-[160px] text-center"
                  >
                    Sign In
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Why Choose BidDaddy?
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Experience the thrill of online auctions with our feature-rich
              platform
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div
                  key={index}
                  className="text-center p-6 rounded-lg hover:shadow-lg transition-shadow"
                >
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 text-blue-600 rounded-full mb-4">
                    <Icon className="w-8 h-8" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600">{feature.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gray-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Start Bidding?</h2>
          <p className="text-xl text-gray-300 mb-8">
            Join thousands of users who trust BidDaddy for their auction needs
          </p>
          {!isAuthenticated && (
            <Link
              to="/register"
              className="inline-block bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold text-lg hover:bg-blue-700 transition-colors"
            >
              Create Your Account
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;
