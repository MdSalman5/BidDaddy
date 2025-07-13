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
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-700 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Welcome to <span className="text-yellow-300">BidDaddy</span>
            </h1>
            <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto">
              The ultimate auction platform where you can bid on amazing items,
              create your own auctions, and join a vibrant community of
              collectors.
            </p>
            <div className="space-x-4">
              {isAuthenticated ? (
                <Link
                  to="/dashboard"
                  className="inline-block bg-yellow-400 text-gray-900 px-8 py-3 rounded-lg font-semibold text-lg hover:bg-yellow-300 transition-colors"
                >
                  Go to Dashboard
                </Link>
              ) : (
                <>
                  <Link
                    to="/register"
                    className="inline-block bg-yellow-400 text-gray-900 px-8 py-3 rounded-lg font-semibold text-lg hover:bg-yellow-300 transition-colors"
                  >
                    Get Started
                  </Link>
                  <Link
                    to="/login"
                    className="inline-block border-2 border-white text-white px-8 py-3 rounded-lg font-semibold text-lg hover:bg-white hover:text-gray-900 transition-colors"
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
