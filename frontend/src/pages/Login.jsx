import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { loginUser, clearError } from "../store/slices/authSlice";
import { authService } from "../services/authService";
import { useTheme } from "../contexts/ThemeContext";
import ThemeToggle from "../components/ThemeToggle";
import { toast } from "react-toastify";
import {
  Eye,
  EyeOff,
  Loader2,
  Mail,
  Lock,
  ArrowRight,
  Shield,
  Star,
  Users,
  Zap,
  Gavel,
  Award,
  CheckCircle,
  Sparkles,
  TrendingUp,
} from "lucide-react";

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { getEffectiveTheme } = useTheme();
  const { error, isAuthenticated } = useSelector((state) => state.auth);

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/dashboard");
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearError());
    }
  }, [error, dispatch]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.email || !formData.password) {
      toast.error("Please fill in all fields");
      return;
    }

    setIsLoading(true);
    try {
      const result = await dispatch(loginUser(formData));
      if (result.type === "auth/login/fulfilled") {
        toast.success("Welcome back! 🎉");
        navigate("/dashboard");
      }
    } catch (error) {
      console.error("Login error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDemoLogin = async (email, password) => {
    setFormData({ email, password });
    setIsLoading(true);
    try {
      const result = await dispatch(loginUser({ email, password }));
      if (result.type === "auth/login/fulfilled") {
        toast.success("Demo login successful! 🎉");
        navigate("/dashboard");
      }
    } catch (error) {
      console.error("Demo login error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const demoUsers = [
    {
      email: "demo@bidder.com",
      password: "demo123",
      role: "Bidder",
      name: "Demo Bidder",
      description: "Enthusiastic auction participant",
      stats: { spent: "$2,500", wins: "5", bids: "23" },
      avatar:
        "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=60&h=60&fit=crop&crop=face",
      color: "blue",
    },
    {
      email: "demo@auctioneer.com",
      password: "demo123",
      role: "Auctioneer",
      name: "Demo Auctioneer",
      description: "Professional auction host",
      stats: { items: "12", commission: "$1,200", rating: "4.9★" },
      avatar:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=60&h=60&fit=crop&crop=face",
      color: "purple",
    },
    {
      email: "john@collector.com",
      password: "demo123",
      role: "Collector",
      name: "John Collector",
      description: "Art & antique specialist",
      stats: { spent: "$15,750", wins: "12", collections: "3" },
      avatar:
        "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=60&h=60&fit=crop&crop=face",
      color: "green",
    },
  ];

  const features = [
    {
      icon: Shield,
      title: "Secure Bidding",
      desc: "Bank-level security",
      color: "green",
    },
    {
      icon: Zap,
      title: "Real-time Updates",
      desc: "Live bid notifications",
      color: "yellow",
    },
    {
      icon: Award,
      title: "Verified Items",
      desc: "Authenticated products",
      color: "purple",
    },
    {
      icon: Users,
      title: "Global Community",
      desc: "50K+ active users",
      color: "blue",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex transition-colors duration-300">
      {/* Theme Toggle */}
      <div className="fixed top-6 right-6 z-50">
        <ThemeToggle variant="modern" />
      </div>

      {/* Left Side - Login Form */}
      <div className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          {/* Header */}
          <div className="text-center animate-slide-up">
            <div className="flex items-center justify-center mb-6">
              <div className="w-16 h-16 bg-gradient-auction rounded-2xl flex items-center justify-center shadow-auction-lg">
                <Gavel className="w-8 h-8 text-white" />
              </div>
            </div>
            <h2 className="text-4xl font-bold text-gray-900 dark:text-gray-100 mb-2">
              Welcome Back!
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400">
              Sign in to continue your auction journey
            </p>
          </div>

          {/* Demo Mode Banner */}
          {authService.isDemoMode() && (
            <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-xl p-4 text-center animate-fade-in">
              <div className="flex items-center justify-center mb-2">
                <Sparkles className="w-5 h-5 text-yellow-600 dark:text-yellow-400 mr-2" />
                <span className="font-semibold text-yellow-800 dark:text-yellow-300">
                  Demo Mode Active
                </span>
              </div>
              <p className="text-sm text-yellow-700 dark:text-yellow-400">
                You're using demo data. Try the demo accounts below!
              </p>
            </div>
          )}

          {/* Login Form */}
          <form
            className="space-y-6 animate-slide-up"
            onSubmit={handleSubmit}
            style={{ animationDelay: "0.1s" }}
          >
            <div className="space-y-4">
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2"
                >
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 w-5 h-5" />
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    className="input-field pl-11 text-lg py-4"
                    placeholder="Enter your email"
                    value={formData.email}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2"
                >
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 w-5 h-5" />
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="current-password"
                    required
                    className="input-field pl-11 pr-11 text-lg py-4"
                    placeholder="Enter your password"
                    value={formData.password}
                    onChange={handleChange}
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300" />
                    ) : (
                      <Eye className="h-5 w-5 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300" />
                    )}
                  </button>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 dark:border-gray-600 rounded dark:bg-gray-700"
                />
                <label
                  htmlFor="remember-me"
                  className="ml-2 block text-sm text-gray-600 dark:text-gray-400"
                >
                  Remember me
                </label>
              </div>

              <div className="text-sm">
                <Link
                  to="/forgot-password"
                  className="font-medium text-blue-600 dark:text-blue-400 hover:text-blue-500 dark:hover:text-blue-300"
                >
                  Forgot password?
                </Link>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="group relative w-full flex justify-center py-4 px-4 border border-transparent text-lg font-semibold rounded-xl text-white bg-gradient-auction hover:shadow-auction-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:focus:ring-offset-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98]"
            >
              {isLoading ? (
                <Loader2 className="w-6 h-6 animate-spin" />
              ) : (
                <>
                  Sign In
                  <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>

          {/* Demo Users Section */}
          <div
            className="mt-8 animate-slide-up"
            style={{ animationDelay: "0.2s" }}
          >
            <div className="text-center mb-4">
              <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Try Demo Accounts
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                One-click login for testing
              </p>
            </div>

            <div className="space-y-3">
              {demoUsers.map((user, index) => (
                <button
                  key={index}
                  onClick={() => handleDemoLogin(user.email, user.password)}
                  disabled={isLoading}
                  className="w-full p-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl hover:border-blue-300 dark:hover:border-blue-600 hover:shadow-auction transition-all duration-200 text-left group disabled:opacity-50 card-hover"
                >
                  <div className="flex items-center space-x-4">
                    <div className="relative">
                      <img
                        src={user.avatar}
                        alt={user.name}
                        className="w-12 h-12 rounded-full object-cover ring-2 ring-gray-200 dark:ring-gray-700"
                      />
                      <div
                        className={`absolute -bottom-1 -right-1 w-4 h-4 bg-${user.color}-500 rounded-full border-2 border-white dark:border-gray-800`}
                      ></div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2">
                        <p className="font-semibold text-gray-900 dark:text-gray-100">
                          {user.name}
                        </p>
                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                            user.role === "Auctioneer"
                              ? "bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-300"
                              : user.role === "Collector"
                                ? "bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-300"
                                : "bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-300"
                          }`}
                        >
                          {user.role}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {user.description}
                      </p>
                      <div className="flex items-center space-x-4 mt-1">
                        {Object.entries(user.stats).map(([key, value]) => (
                          <span
                            key={key}
                            className="text-xs text-gray-500 dark:text-gray-400"
                          >
                            <span className="font-medium">{value}</span> {key}
                          </span>
                        ))}
                      </div>
                    </div>
                    <CheckCircle className="w-5 h-5 text-green-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Sign Up Link */}
          <div
            className="text-center animate-slide-up"
            style={{ animationDelay: "0.3s" }}
          >
            <p className="text-gray-600 dark:text-gray-400">
              Don't have an account?{" "}
              <Link
                to="/register"
                className="font-semibold text-blue-600 dark:text-blue-400 hover:text-blue-500 dark:hover:text-blue-300 transition-colors"
              >
                Create one now
              </Link>
            </p>
          </div>
        </div>
      </div>

      {/* Right Side - Features & Branding */}
      <div className="hidden lg:flex lg:flex-1 bg-gradient-auction relative overflow-hidden">
        <div className="absolute inset-0 bg-black bg-opacity-10 dark:bg-opacity-20"></div>

        {/* Decorative Elements */}
        <div className="absolute top-20 right-20 w-32 h-32 bg-white bg-opacity-20 rounded-full animate-bounce-gentle"></div>
        <div className="absolute bottom-20 left-20 w-24 h-24 bg-white bg-opacity-15 rounded-full animate-pulse-slow"></div>
        <div className="absolute top-1/2 right-10 w-16 h-16 bg-white bg-opacity-10 rounded-full"></div>

        <div className="relative z-10 flex flex-col justify-center px-12 py-16 text-white">
          <div className="max-w-md">
            <h1 className="text-5xl font-bold mb-6 animate-slide-up">
              Premium Auction Experience
            </h1>
            <p
              className="text-xl text-blue-100 mb-8 leading-relaxed animate-slide-up"
              style={{ animationDelay: "0.1s" }}
            >
              Join thousands of collectors and discover unique items in our
              trusted marketplace.
            </p>

            <div className="space-y-6">
              {features.map((feature, index) => {
                const Icon = feature.icon;
                return (
                  <div
                    key={index}
                    className="flex items-center space-x-4 animate-slide-up"
                    style={{ animationDelay: `${0.2 + index * 0.1}s` }}
                  >
                    <div
                      className={`w-12 h-12 bg-white bg-opacity-20 rounded-xl flex items-center justify-center backdrop-blur-sm`}
                    >
                      <Icon className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg">{feature.title}</h3>
                      <p className="text-blue-100">{feature.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Stats */}
            <div
              className="mt-12 grid grid-cols-3 gap-6 animate-slide-up"
              style={{ animationDelay: "0.6s" }}
            >
              <div className="text-center">
                <div className="text-3xl font-bold flex items-center justify-center">
                  50K+
                  <TrendingUp className="w-6 h-6 ml-1 text-green-400" />
                </div>
                <div className="text-blue-100 text-sm">Active Users</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold">$2M+</div>
                <div className="text-blue-100 text-sm">Items Sold</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold flex items-center justify-center">
                  99%
                  <Star className="w-5 h-5 ml-1 text-yellow-400" />
                </div>
                <div className="text-blue-100 text-sm">Satisfaction</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
