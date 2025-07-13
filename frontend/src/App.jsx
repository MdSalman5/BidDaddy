import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { Provider } from "react-redux";
import { store } from "./store/store";
import { ThemeProvider } from "./contexts/ThemeContext";
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
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
// Import global error handler to initialize it
import "./utils/globalErrorHandler";

const App = () => {
  return (
    <Provider store={store}>
      <ThemeProvider defaultTheme="system" storageKey="auction-theme">
        <ErrorBoundary>
          <Router>
            <div className="min-h-screen bg-gray-50 dark:bg-gray-950 transition-colors duration-300 lg:flex">
              <DemoNotification />
              <SideDrawer />
              <div className="flex-1 lg:overflow-hidden">
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/register" element={<Register />} />
                  <Route path="/auctions" element={<AuctionList />} />
                  <Route path="/auction/:id" element={<AuctionDetail />} />
                  <Route
                    path="/dashboard"
                    element={
                      <ProtectedRoute>
                        <Dashboard />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/my-auctions"
                    element={
                      <ProtectedRoute>
                        <MyAuctions />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/my-bids"
                    element={
                      <ProtectedRoute>
                        <MyBids />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/create-auction"
                    element={
                      <ProtectedRoute>
                        <CreateAuction />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/profile"
                    element={
                      <ProtectedRoute>
                        <Dashboard />
                      </ProtectedRoute>
                    }
                  />
                  <Route path="/leaderboard" element={<Dashboard />} />
                  <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
              </div>
            </div>
            <ToastContainer
              position="top-right"
              autoClose={5000}
              hideProgressBar={false}
              newestOnTop={false}
              closeOnClick
              rtl={false}
              pauseOnFocusLoss
              draggable
              pauseOnHover
              theme="colored"
              toastClassName="dark:bg-gray-800 dark:text-gray-100"
            />
          </Router>
        </ErrorBoundary>
      </ThemeProvider>
    </Provider>
  );
};

export default App;
