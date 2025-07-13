import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logoutUser, getUserProfile } from "../store/slices/authSlice";
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
} from "lucide-react";
import { toast } from "react-toastify";

const SideDrawer = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

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
    { name: "Dashboard", icon: Home, path: "/dashboard" },
    { name: "All Auctions", icon: Gavel, path: "/auctions" },
    {
      name: "My Auctions",
      icon: User,
      path: "/my-auctions",
      authRequired: true,
    },
    {
      name: "Create Auction",
      icon: Plus,
      path: "/create-auction",
      authRequired: true,
      roleRequired: "Auctioneer",
    },
    { name: "Leaderboard", icon: TrendingUp, path: "/leaderboard" },
    { name: "Profile", icon: Settings, path: "/profile", authRequired: true },
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
      {/* Mobile menu button */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="bg-white p-2 rounded-md shadow-lg"
        >
          {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } lg:static lg:inset-0`}
      >
        {/* Logo */}
        <div className="flex items-center justify-center h-16 px-4 border-b">
          <Link to="/" className="text-2xl font-bold text-blue-600">
            BidDaddy
          </Link>
        </div>

        {/* User info */}
        {isAuthenticated && user && (
          <div className="p-4 border-b">
            <div className="flex items-center space-x-3">
              <img
                src={user.profileImage?.url || "/default-avatar.png"}
                alt={user.userName}
                className="w-10 h-10 rounded-full object-cover"
              />
              <div>
                <p className="font-medium text-gray-900">{user.userName}</p>
                <p className="text-sm text-gray-500">{user.role}</p>
              </div>
            </div>
          </div>
        )}

        {/* Navigation */}
        <nav className="flex-1 px-2 py-4 space-y-1">
          {filteredMenuItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.name}
                to={item.path}
                onClick={() => setIsOpen(false)}
                className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md transition-colors ${
                  isCurrentPath(item.path)
                    ? "bg-blue-100 text-blue-700"
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                }`}
              >
                <Icon
                  className={`mr-3 flex-shrink-0 h-5 w-5 ${
                    isCurrentPath(item.path)
                      ? "text-blue-700"
                      : "text-gray-400 group-hover:text-gray-500"
                  }`}
                />
                {item.name}
              </Link>
            );
          })}
        </nav>

        {/* Auth buttons */}
        <div className="border-t p-4">
          {isAuthenticated ? (
            <button
              onClick={handleLogout}
              className="group flex items-center w-full px-2 py-2 text-sm font-medium text-gray-600 rounded-md hover:bg-red-50 hover:text-red-700 transition-colors"
            >
              <LogOut className="mr-3 flex-shrink-0 h-5 w-5 text-gray-400 group-hover:text-red-500" />
              Sign out
            </button>
          ) : (
            <div className="space-y-2">
              <Link
                to="/login"
                onClick={() => setIsOpen(false)}
                className="block w-full text-center bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
              >
                Sign In
              </Link>
              <Link
                to="/register"
                onClick={() => setIsOpen(false)}
                className="block w-full text-center border border-blue-600 text-blue-600 py-2 px-4 rounded-md hover:bg-blue-50 transition-colors"
              >
                Sign Up
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Main content offset for desktop */}
      <div className="lg:ml-64">
        {/* Content will be rendered here by the router */}
      </div>
    </>
  );
};

export default SideDrawer;
