import React, { useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  Outlet,
} from "react-router-dom";
import { Provider, useDispatch, useSelector } from "react-redux";
import { store } from "./store/store";
import { ThemeProvider } from "./contexts/ThemeContext";
import { SidebarProvider, useSidebar } from "./contexts/SidebarContext";
import { getUserProfile, clearAuth } from "./store/slices/authSlice";
import { initializeServices, getServiceStatus } from "./services";
import SideDrawer from "./layout/SideDrawer";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import AuctionList from "./pages/AuctionList";
import AuctionDetail from "./pages/AuctionDetail";
import CreateAuction from "./pages/CreateAuction";
import MyAuctions from "./pages/MyAuctions";
import MyBids from "./pages/MyBids";
import Profile from "./pages/Profile";
import Leaderboard from "./pages/Leaderboard";
import ProtectedRoute from "./components/ProtectedRoute";
import DemoNotification from "./components/DemoNotification";
import ErrorBoundary from "./components/ErrorBoundary";
import LoadingSpinner from "./components/LoadingSpinner";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./utils/globalErrorHandler";

const MainLayout = () => {
  const { isOpen } = useSidebar();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <DemoNotification />
      <SideDrawer />
      <main
        className={`transition-all duration-300 ease-in-out ${
          isOpen ? "lg:ml-72" : "ml-0"
        }`}
      >
        <div className="min-h-screen">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

const AppContent = () => {
  const dispatch = useDispatch();
  const { isAuthenticated, loading } = useSelector((state) => state.auth);
  const [appInitialized, setAppInitialized] = useState(false);
  const [serviceStatus, setServiceStatus] = useState(null);

  // Initialize app on mount
  useEffect(() => {
    const init = async () => {
      try {
        console.log("🚀 Starting BidDaddy application...");

        // Initialize services with backend connectivity check
        const serviceInit = await initializeServices();
        setServiceStatus(serviceInit.status);

        // Show appropriate notification based on service status
        if (serviceInit.status.backendConnected) {
          console.log("✅ Connected to live backend");
        } else {
          console.log("🎭 Running in demo mode");
          toast.info("Demo mode active - some features may be limited", {
            autoClose: 5000,
            position: "top-center",
          });
        }

        // Check if user should be auto-logged in
        const token =
          localStorage.getItem("token") || localStorage.getItem("demoUser");
        if (token && !isAuthenticated) {
          try {
            console.log("🔐 Checking existing authentication...");
            await dispatch(getUserProfile()).unwrap();
            console.log("✅ User authenticated successfully");
          } catch (error) {
            console.warn("⚠️ Auth check failed:", error.message);
            // Clear invalid auth data
            dispatch(clearAuth());
            localStorage.removeItem("token");
            localStorage.removeItem("demoUser");
          }
        }

        setAppInitialized(true);
        console.log("🎉 Application initialized successfully");
      } catch (error) {
        console.error("❌ App initialization failed:", error);

        // Force demo mode and continue
        localStorage.setItem("useDemoMode", "true");
        setServiceStatus({
          backendConnected: false,
          demoMode: true,
          online: navigator.onLine,
          message: "Initialization failed, using demo mode",
        });

        toast.error("Failed to connect to backend. Using demo mode.", {
          autoClose: 5000,
        });

        setAppInitialized(true); // Still allow app to load
      }
    };

    init();

    // Setup connection monitoring
    const handleOnline = async () => {
      console.log("🌐 Connection restored, checking backend...");
      try {
        const status = await getServiceStatus();
        setServiceStatus(status);

        if (status.backendConnected) {
          toast.success("Connected to live backend!", { autoClose: 3000 });
        } else {
          toast.warning("Connection restored but backend unavailable", {
            autoClose: 3000,
          });
        }
      } catch (error) {
        console.warn("Failed to check service status on reconnect");
      }
    };

    const handleOffline = () => {
      console.log("📴 Connection lost");
      localStorage.setItem("useDemoMode", "true");
      setServiceStatus((prev) => ({
        ...prev,
        online: false,
        demoMode: true,
      }));
      toast.warning("Connection lost. Demo mode enabled.", { autoClose: 3000 });
    };

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, [dispatch, isAuthenticated]);

  // Show loading spinner during initialization or auth check
  if (!appInitialized || loading) {
    return (
      <LoadingSpinner
        fullScreen
        size="lg"
        text={
          !appInitialized
            ? "Connecting to backend..."
            : "Checking authentication..."
        }
      />
    );
  }

  return (
    <Routes>
      {/* Auth routes without sidebar */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Main app routes with sidebar */}
      <Route path="/" element={<MainLayout />}>
        <Route index element={<Home />} />
        <Route path="auctions" element={<AuctionList />} />
        <Route path="auction/:id" element={<AuctionDetail />} />
        <Route path="leaderboard" element={<Leaderboard />} />

        {/* Protected routes */}
        <Route
          path="dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="my-auctions"
          element={
            <ProtectedRoute>
              <MyAuctions />
            </ProtectedRoute>
          }
        />
        <Route
          path="my-bids"
          element={
            <ProtectedRoute>
              <MyBids />
            </ProtectedRoute>
          }
        />
        <Route
          path="create-auction"
          element={
            <ProtectedRoute>
              <CreateAuction />
            </ProtectedRoute>
          }
        />
        <Route
          path="profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />

        {/* Catch all */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
};

const App = () => {
  return (
    <Provider store={store}>
      <ThemeProvider defaultTheme="system" storageKey="auction-theme">
        <SidebarProvider>
          <ErrorBoundary>
            <Router>
              <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
                <AppContent />
                <ToastContainer
                  position="top-right"
                  autoClose={3000}
                  hideProgressBar={false}
                  newestOnTop
                  closeOnClick
                  rtl={false}
                  pauseOnFocusLoss={false}
                  draggable
                  pauseOnHover
                  theme="colored"
                  className="mt-16 z-50"
                  toastClassName="dark:bg-gray-800 dark:text-gray-100"
                />
              </div>
            </Router>
          </ErrorBoundary>
        </SidebarProvider>
      </ThemeProvider>
    </Provider>
  );
};

export default App;
