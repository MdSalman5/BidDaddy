import React, { useEffect } from "react";
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
import { getUserProfile } from "./store/slices/authSlice";
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
import { ToastContainer } from "react-toastify";
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
        <div className="min-h-screen p-4 lg:p-6">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

const AppContent = () => {
  const dispatch = useDispatch();
  const { isAuthenticated, loading, user } = useSelector((state) => state.auth);

  // Initialize auth check on app load - only once
  useEffect(() => {
    const token =
      localStorage.getItem("token") || localStorage.getItem("demoUser");
    if (token && !isAuthenticated && !user && !loading) {
      dispatch(getUserProfile());
    }
  }, [dispatch]); // Remove dependencies to prevent loops

  if (loading) {
    return <LoadingSpinner fullScreen />;
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
                  pauseOnFocusLoss
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
