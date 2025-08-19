import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logoutUser, getUserProfile } from "../store/slices/authSlice";
import { useTheme } from "../contexts/ThemeContext";
import { useSidebar } from "../contexts/SidebarContext";
import {
  Home,
  Gavel,
  Plus,
  User,
  LogOut,
  Menu,
  X,
  TrendingUp,
  Search,
  Bell,
  Award,
  Heart,
  Settings,
  Sun,
  Moon,
  Monitor,
  ChevronRight,
} from "lucide-react";
import { toast } from "react-toastify";

const SideDrawer = () => {
  const { isOpen, toggleSidebar } = useSidebar();
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { theme, setTheme, getEffectiveTheme } = useTheme();

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
      category: "main",
    },
    {
      name: "Browse Auctions",
      icon: Search,
      path: "/auctions",
      category: "main",
    },
    {
      name: "My Auctions",
      icon: Gavel,
      path: "/my-auctions",
      authRequired: true,
      category: "user",
    },
    {
      name: "My Bids",
      icon: Heart,
      path: "/my-bids",
      authRequired: true,
      category: "user",
    },
    {
      name: "Create Auction",
      icon: Plus,
      path: "/create-auction",
      authRequired: true,
      roleRequired: "Auctioneer",
      category: "actions",
    },
    {
      name: "Leaderboard",
      icon: TrendingUp,
      path: "/leaderboard",
      category: "discover",
    },
    {
      name: "Profile",
      icon: User,
      path: "/profile",
      authRequired: true,
      category: "account",
    },
    {
      name: "Settings",
      icon: Settings,
      path: "/settings",
      authRequired: true,
      category: "account",
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

  const themeOptions = [
    { value: "light", label: "Light", icon: Sun },
    { value: "dark", label: "Dark", icon: Moon },
    { value: "system", label: "System", icon: Monitor },
  ];

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={toggleSidebar}
        className="fixed top-4 left-4 z-50 lg:hidden p-2 rounded-lg bg-white dark:bg-gray-800 shadow-lg border border-gray-200 dark:border-gray-700"
      >
        {isOpen ? (
          <X className="w-5 h-5 text-gray-600 dark:text-gray-300" />
        ) : (
          <Menu className="w-5 h-5 text-gray-600 dark:text-gray-300" />
        )}
      </button>

      {/* Desktop Menu Button */}
      <button
        onClick={toggleSidebar}
        className="hidden lg:block fixed top-6 left-6 z-50 p-2 rounded-lg bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm shadow-lg border border-gray-200/50 dark:border-gray-700/50 hover:bg-white dark:hover:bg-gray-800 transition-all"
      >
        {isOpen ? (
          <X className="w-5 h-5 text-gray-600 dark:text-gray-300" />
        ) : (
          <Menu className="w-5 h-5 text-gray-600 dark:text-gray-300" />
        )}
      </button>

      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={toggleSidebar}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 z-50 h-screen w-72 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 transform transition-transform duration-300 lg:duration-200 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } flex flex-col`}
      >
        {/* Header */}
        <div className="h-16 flex items-center justify-between px-6 border-b border-gray-200 dark:border-gray-800 bg-gradient-to-r from-blue-600 to-purple-600">
          <Link to="/" className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
              <Gavel className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h1 className="text-white font-bold text-lg">BidDaddy</h1>
              <p className="text-blue-100 text-xs">Premium Auctions</p>
            </div>
          </Link>
        </div>

        {/* User Profile (if authenticated) */}
        {isAuthenticated && user && (
          <div className="p-6 border-b border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50">
            <div className="flex items-center space-x-3">
              <img
                src={user.profileImage?.url || "/default-avatar.png"}
                alt={user.userName}
                className="w-10 h-10 rounded-full object-cover border-2 border-gray-200 dark:border-gray-700"
              />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                  {user.userName}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                  {user.role}
                </p>
              </div>
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            </div>

            {/* Quick Stats */}
            <div className="mt-4 grid grid-cols-2 gap-3">
              <div className="text-center p-2 bg-white dark:bg-gray-700 rounded-lg">
                <p className="text-lg font-semibold text-gray-900 dark:text-white">
                  {user.auctionsWon || 0}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">Won</p>
              </div>
              <div className="text-center p-2 bg-white dark:bg-gray-700 rounded-lg">
                <p className="text-lg font-semibold text-gray-900 dark:text-white">
                  ${user.moneySpent || 0}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Spent
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Navigation */}
        <div className="flex-1 overflow-y-auto py-4">
          <nav className="px-3 space-y-1">
            {filteredMenuItems.map((item) => {
              const Icon = item.icon;
              const isActive = isCurrentPath(item.path);

              return (
                <Link
                  key={item.name}
                  to={item.path}
                  onClick={() => window.innerWidth < 1024 && toggleSidebar()}
                  className={`group flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-all duration-200 ${
                    isActive
                      ? "bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300"
                      : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                  }`}
                >
                  <Icon
                    className={`mr-3 flex-shrink-0 w-5 h-5 transition-colors ${
                      isActive
                        ? "text-blue-600 dark:text-blue-400"
                        : "text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300"
                    }`}
                  />
                  <span className="flex-1">{item.name}</span>
                  {isActive && (
                    <div className="w-1.5 h-1.5 bg-blue-600 dark:bg-blue-400 rounded-full"></div>
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Notifications (if authenticated) */}
          {isAuthenticated && (
            <div className="mt-6 px-3">
              <div className="border-t border-gray-200 dark:border-gray-800 pt-4">
                <button className="w-full flex items-center px-3 py-2.5 text-sm font-medium text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                  <Bell className="mr-3 w-5 h-5 text-gray-400" />
                  <span className="flex-1 text-left">Notifications</span>
                  <span className="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
                    3
                  </span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 dark:border-gray-800 p-4 space-y-3 bg-gray-50 dark:bg-gray-800/50">
          {/* Theme Selector */}
          <div className="space-y-2">
            <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
              Theme
            </p>
            <div className="flex space-x-1 p-1 bg-gray-200 dark:bg-gray-700 rounded-lg">
              {themeOptions.map((option) => {
                const Icon = option.icon;
                const isSelected = theme === option.value;

                return (
                  <button
                    key={option.value}
                    onClick={() => setTheme(option.value)}
                    className={`flex-1 flex items-center justify-center p-2 rounded-md transition-all ${
                      isSelected
                        ? "bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow-sm"
                        : "text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
                    }`}
                    title={option.label}
                  >
                    <Icon className="w-4 h-4" />
                  </button>
                );
              })}
            </div>
          </div>

          {/* Auth Actions */}
          {isAuthenticated ? (
            <button
              onClick={handleLogout}
              className="w-full flex items-center px-3 py-2.5 text-sm font-medium text-red-600 dark:text-red-400 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
            >
              <LogOut className="mr-3 w-5 h-5" />
              Sign out
            </button>
          ) : (
            <div className="space-y-2">
              <Link
                to="/login"
                onClick={() => window.innerWidth < 1024 && toggleSidebar()}
                className="block w-full px-3 py-2.5 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg text-center transition-colors"
              >
                Sign In
              </Link>
              <Link
                to="/register"
                onClick={() => window.innerWidth < 1024 && toggleSidebar()}
                className="block w-full px-3 py-2.5 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg text-center transition-colors"
              >
                Sign Up
              </Link>
            </div>
          )}

          {/* Footer Text */}
          <div className="pt-2 border-t border-gray-200 dark:border-gray-800">
            <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
              © 2024 BidDaddy
            </p>
          </div>
        </div>
      </aside>
    </>
  );
};

export default SideDrawer;
