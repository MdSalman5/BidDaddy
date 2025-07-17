import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logoutUser, getUserProfile } from "../store/slices/authSlice";
import { useTheme } from "../contexts/ThemeContext";
import ThemeToggle from "../components/ThemeToggle";
import {
  Home,
  Gavel,
  Plus,
  User,
  LogOut,
  Menu,
  X,
  TrendingUp,
  Settings,
  Search,
  Bell,
  Award,
  Grid3X3,
  BarChart3,
  Heart,
  CreditCard,
  Shield,
  Star,
} from "lucide-react";
import { toast } from "react-toastify";

const SideDrawer = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { theme, getEffectiveTheme } = useTheme();

  const { user, isAuthenticated, loading } = useSelector((state) => state.auth);

  useEffect(() => {
    if (!isAuthenticated && !loading) {
      dispatch(getUserProfile());
    }
  }, [dispatch, isAuthenticated, loading]);

  const handleLogout = async () => {
    try {
      await dispatch(logoutUser()).unwrap();
      toast.success("Logged out successfully");
      navigate("/login");
    } catch (error) {
      toast.error("Logout failed");
    }
  };

  const menuItems = [
    {
      name: "Dashboard",
      icon: Home,
      path: "/dashboard",
      description: "Overview and active auctions",
    },
    {
      name: "Browse Auctions",
      icon: Search,
      path: "/auctions",
      description: "Discover items to bid on",
    },
    {
      name: "My Auctions",
      icon: Gavel,
      path: "/my-auctions",
      authRequired: true,
      description: "Manage your auction items",
    },
    {
      name: "My Bids",
      icon: Heart,
      path: "/my-bids",
      authRequired: true,
      description: "Track your bidding activity",
    },
    {
      name: "Create Auction",
      icon: Plus,
      path: "/create-auction",
      authRequired: true,
      roleRequired: "Auctioneer",
      description: "List a new item for auction",
    },
    {
      name: "Leaderboard",
      icon: TrendingUp,
      path: "/leaderboard",
      description: "Top bidders and statistics",
    },
    {
      name: "Profile",
      icon: User,
      path: "/profile",
      authRequired: true,
      description: "Manage your account",
    },
  ];

  const filteredMenuItems = menuItems.filter((item) => {
    if (item.authRequired && !isAuthenticated) return false;
    if (item.roleRequired && user?.role !== item.roleRequired) return false;
    return true;
  });

  const isCurrentPath = (path) => location.pathname === path;

  // Don't show navigation on auth pages
  if (["/login", "/register"].includes(location.pathname)) {
    return null;
  }

  return (
    <>
      {/* Toggle button for all screen sizes */}
      <div className="fixed top-4 left-4 z-50">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm p-3 rounded-xl shadow-lg border border-gray-200/50 dark:border-gray-700/50 hover:shadow-xl transition-all duration-200 hover:scale-105"
        >
          {isOpen ? (
            <X className="w-6 h-6 text-gray-700 dark:text-gray-300" />
          ) : (
            <Menu className="w-6 h-6 text-gray-700 dark:text-gray-300" />
          )}
        </button>
      </div>

      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden backdrop-blur-sm transition-opacity duration-300"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={`${
          // Mobile: fixed overlay
          "fixed inset-y-0 left-0 z-50 w-72 sm:w-80 bg-white dark:bg-gray-900 shadow-2xl transform transition-all duration-300 ease-in-out border-r border-gray-200 dark:border-gray-800 " +
          // Desktop: static sidebar
          "lg:static lg:inset-auto lg:w-80 xl:w-[22rem] lg:bg-white lg:dark:bg-gray-900 lg:shadow-none lg:transform-none lg:transition-none " +
          // Mobile transform
          (isOpen ? "translate-x-0" : "-translate-x-full") +
          // Desktop always visible
          " lg:translate-x-0"
        }`}
      >
        {/* Logo */}
        <div className="flex items-center justify-between h-16 sm:h-20 px-4 sm:px-6 border-b border-gray-100/50 dark:border-gray-800/50 bg-gradient-auction">
          <Link to="/" className="flex items-center space-x-2 sm:space-x-3">
            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-white dark:bg-gray-800 rounded-xl flex items-center justify-center shadow-lg">
              <Gavel className="w-4 h-4 sm:w-6 sm:h-6 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <h1 className="text-lg sm:text-2xl font-bold text-white">
                BidDaddy
              </h1>
              <p className="text-blue-100 text-xs hidden sm:block">
                Premium Auctions
              </p>
            </div>
          </Link>
          <div className="lg:hidden">
            <button
              onClick={() => setIsOpen(false)}
              className="text-white hover:text-blue-100 transition-colors p-1"
            >
              <X className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>
          </div>
        </div>

        {/* User info */}
        {isAuthenticated && user && (
          <div className="p-4 sm:p-6 border-b border-gray-100/50 dark:border-gray-800/50 bg-gray-50/80 dark:bg-gray-800/30 backdrop-blur-sm">
            <div className="flex items-center space-x-4">
              <div className="relative">
                <img
                  src={user.profileImage?.url || "/default-avatar.png"}
                  alt={user.userName}
                  className="w-14 h-14 rounded-xl object-cover border-2 border-white dark:border-gray-700 shadow-md"
                />
                <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 border-2 border-white dark:border-gray-700 rounded-full"></div>
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-gray-900 dark:text-gray-100 truncate">
                  {user.userName}
                </p>
                <div className="flex items-center space-x-2">
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      user.role === "Auctioneer"
                        ? "bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-300"
                        : "bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-300"
                    }`}
                  >
                    {user.role === "Auctioneer" ? (
                      <Award className="w-3 h-3 mr-1" />
                    ) : (
                      <User className="w-3 h-3 mr-1" />
                    )}
                    {user.role}
                  </span>
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  ${user.moneySpent || 0} spent
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Quick Stats */}
        {isAuthenticated && user && (
          <div className="p-6 border-b border-gray-100 dark:border-gray-800">
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-100 dark:border-blue-800">
                <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                  {user.auctionsWon || 0}
                </p>
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  Auctions Won
                </p>
              </div>
              <div className="text-center p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-100 dark:border-green-800">
                <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                  {user.unpaidCommission || 0}
                </p>
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  Commissions
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Navigation */}
        <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
          {filteredMenuItems.map((item) => {
            const Icon = item.icon;
            const isActive = isCurrentPath(item.path);
            return (
              <Link
                key={item.name}
                to={item.path}
                onClick={() => setIsOpen(false)}
                className={`group flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 ease-in-out ${
                  isActive
                    ? "bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 shadow-sm border border-blue-100 dark:border-blue-800"
                    : "text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-gray-100"
                }`}
              >
                <Icon
                  className={`mr-4 flex-shrink-0 h-5 w-5 transition-colors ${
                    isActive
                      ? "text-blue-600 dark:text-blue-400"
                      : "text-gray-400 dark:text-gray-500 group-hover:text-gray-600 dark:group-hover:text-gray-300"
                  }`}
                />
                <div className="flex-1 min-w-0">
                  <p className="truncate">{item.name}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                    {item.description}
                  </p>
                </div>
                {isActive && (
                  <div className="w-2 h-2 bg-blue-600 dark:bg-blue-400 rounded-full animate-pulse"></div>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Bottom section */}
        <div className="border-t border-gray-100 dark:border-gray-800 p-4 space-y-4">
          {/* Theme Toggle */}
          <div className="space-y-2">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Theme
            </span>
            <ThemeToggle variant="modern" className="w-full" />
          </div>

          {/* Notifications */}
          {isAuthenticated && (
            <button className="w-full flex items-center px-4 py-3 text-sm font-medium text-gray-600 dark:text-gray-400 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors group">
              <Bell className="mr-4 h-5 w-5 text-gray-400 dark:text-gray-500 group-hover:text-gray-600 dark:group-hover:text-gray-300" />
              <span className="flex-1 text-left">Notifications</span>
              <span className="bg-red-500 text-white text-xs rounded-full px-2 py-1">
                3
              </span>
            </button>
          )}

          {/* Auth buttons */}
          {isAuthenticated ? (
            <button
              onClick={handleLogout}
              className="w-full flex items-center px-4 py-3 text-sm font-medium text-red-600 dark:text-red-400 rounded-xl hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors group"
            >
              <LogOut className="mr-4 h-5 w-5" />
              Sign out
            </button>
          ) : (
            <div className="space-y-3">
              <Link
                to="/login"
                onClick={() => setIsOpen(false)}
                className="block w-full text-center btn-primary"
              >
                Sign In
              </Link>
              <Link
                to="/register"
                onClick={() => setIsOpen(false)}
                className="block w-full text-center btn-secondary"
              >
                Sign Up
              </Link>
            </div>
          )}

          {/* Footer info */}
          <div className="pt-4 border-t border-gray-100 dark:border-gray-800">
            <div className="flex items-center justify-center space-x-4 text-xs text-gray-500 dark:text-gray-400">
              <div className="flex items-center space-x-1">
                <Shield className="w-3 h-3" />
                <span>Secure</span>
              </div>
              <div className="flex items-center space-x-1">
                <Star className="w-3 h-3" />
                <span>4.9/5</span>
              </div>
            </div>
            <p className="text-center text-xs text-gray-400 dark:text-gray-500 mt-2">
              © 2024 BidDaddy. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default SideDrawer;
