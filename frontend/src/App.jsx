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
import {
  initializeApp,
  setupConnectionMonitoring,
} from "./utils/appInitializer";
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
  const [initializationError, setInitializationError] = useState(null);

  // Initialize app on mount
  useEffect(() => {
    const init = async () => {
      try {
        // Initialize app and check connectivity
        const initResult = await initializeApp();

        if (initResult.mode === "demo") {
          toast.info(initResult.message, { autoClose: 5000 });
        }

        // Check if user should be auto-logged in
        const token =
          localStorage.getItem("token") || localStorage.getItem("demoUser");
        if (token && !isAuthenticated) {
          try {
            await dispatch(getUserProfile()).unwrap();
          } catch (error) {
            // Clear invalid auth data
            dispatch(clearAuth());
            localStorage.removeItem("token");
            localStorage.removeItem("demoUser");
          }
        }

        setAppInitialized(true);
      } catch (error) {
        console.error("App initialization failed:", error);
        setInitializationError(error.message);
        setAppInitialized(true); // Still allow app to load
      }
    };

    init();

    // Setup connection monitoring
    const cleanup = setupConnectionMonitoring((status) => {
      if (!status.online) {
        toast.warning("Connection lost. Switching to demo mode.", {
          autoClose: 3000,
        });
      } else {
        toast.success("Connection restored!", { autoClose: 2000 });
      }
    });

    return cleanup;
  }, [dispatch, isAuthenticated]);

  // Show loading spinner during initialization or auth check
  if (!appInitialized || loading) {
    return (
      <LoadingSpinner
        fullScreen
        text={
          !appInitialized
            ? "Initializing application..."
            : "Checking authentication..."
        }
      />
    );
  }

  // Show error if initialization failed critically
  if (initializationError && !appInitialized) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-6">
          <h1 className="text-2xl font-bold text-red-600 dark:text-red-400 mb-4">
            Initialization Failed
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            {initializationError}
          </p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Reload Application
          </button>
        </div>
      </div>
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
