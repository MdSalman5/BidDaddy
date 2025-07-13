import React, { useState, useEffect } from "react";
import { authService } from "../services/authService";
import connectionService from "../services/connectionService";
import {
  X,
  Info,
  Wifi,
  WifiOff,
  Server,
  AlertTriangle,
  CheckCircle,
} from "lucide-react";

const DemoNotification = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState(
    connectionService.getConnectionStatus(),
  );

  useEffect(() => {
    const checkDemoMode = () => {
      const isDemoMode = authService.isDemoMode();
      const hasBeenDismissed =
        localStorage.getItem("demoNotificationDismissed") === "true";

      if (isDemoMode && !hasBeenDismissed) {
        setIsVisible(true);
      }
    };

    checkDemoMode();

    // Subscribe to connection events
    const unsubscribe = connectionService.subscribe((event) => {
      setConnectionStatus(connectionService.getConnectionStatus());

      if (event.type === "demo_mode_enabled") {
        setIsVisible(true);
        setIsDismissed(false);
        localStorage.removeItem("demoNotificationDismissed");
      }
    });

    return () => {
      unsubscribe();
    };
  }, []);

  const handleDismiss = () => {
    setIsVisible(false);
    setIsDismissed(true);
    localStorage.setItem("demoNotificationDismissed", "true");
  };

  const handleToggleDemoMode = async () => {
    const currentMode = authService.isDemoMode();

    if (currentMode) {
      // Switching to live mode - check backend first
      const isBackendHealthy = await connectionService.forceHealthCheck();

      if (isBackendHealthy) {
        authService.toggleDemoMode(false);
        connectionService.setDemoMode(false);
        setIsVisible(false);
        localStorage.removeItem("demoNotificationDismissed");
        window.location.reload();
      } else {
        alert("Backend server is not available. Cannot switch to live mode.");
      }
    } else {
      // Switching to demo mode
      authService.toggleDemoMode(true);
      connectionService.setDemoMode(true);
      setIsVisible(true);
      window.location.reload();
    }
  };

  const getNotificationConfig = () => {
    if (connectionStatus.demoMode) {
      if (connectionStatus.backend === "offline") {
        return {
          icon: WifiOff,
          bgColor: "bg-yellow-50 dark:bg-yellow-900/20",
          borderColor: "border-yellow-200 dark:border-yellow-800",
          iconColor: "text-yellow-600 dark:text-yellow-400",
          titleColor: "text-yellow-800 dark:text-yellow-300",
          textColor: "text-yellow-700 dark:text-yellow-400",
          title: "Demo Mode Active",
          message:
            "Backend server is not connected. Using demo data with full functionality.",
        };
      } else {
        return {
          icon: Info,
          bgColor: "bg-blue-50 dark:bg-blue-900/20",
          borderColor: "border-blue-200 dark:border-blue-800",
          iconColor: "text-blue-600 dark:text-blue-400",
          titleColor: "text-blue-800 dark:text-blue-300",
          textColor: "text-blue-700 dark:text-blue-400",
          title: "Demo Mode Active",
          message:
            "You're using demo data. Backend is available but demo mode is enabled.",
        };
      }
    }

    return null;
  };

  const config = getNotificationConfig();

  if (!isVisible || isDismissed || !config) {
    return null;
  }

  const Icon = config.icon;

  return (
    <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 max-w-md w-full mx-4 animate-slide-up">
      <div
        className={`${config.bgColor} border ${config.borderColor} rounded-xl shadow-auction p-4 backdrop-blur-sm`}
      >
        <div className="flex items-start">
          <div className="flex-shrink-0">
            <Icon className={`h-6 w-6 ${config.iconColor}`} />
          </div>
          <div className="ml-3 flex-1">
            <div className="flex items-center justify-between mb-1">
              <h3 className={`text-sm font-semibold ${config.titleColor}`}>
                {config.title}
              </h3>
              <div className="flex items-center space-x-1">
                {/* Connection Status Indicators */}
                <div className="flex items-center space-x-1">
                  <div
                    className={`w-2 h-2 rounded-full ${
                      connectionStatus.network === "online"
                        ? "bg-green-500"
                        : "bg-red-500"
                    }`}
                    title={`Network: ${connectionStatus.network}`}
                  ></div>
                  <div
                    className={`w-2 h-2 rounded-full ${
                      connectionStatus.backend === "online"
                        ? "bg-green-500"
                        : connectionStatus.backend === "offline"
                          ? "bg-red-500"
                          : "bg-yellow-500"
                    }`}
                    title={`Backend: ${connectionStatus.backend}`}
                  ></div>
                </div>
              </div>
            </div>
            <p className={`text-sm ${config.textColor} mb-3`}>
              {config.message}
            </p>
            <div className="flex items-center space-x-2">
              <button
                onClick={handleToggleDemoMode}
                className={`text-sm px-3 py-1 rounded-md transition-colors ${
                  connectionStatus.backend === "online"
                    ? "bg-blue-600 hover:bg-blue-700 text-white"
                    : "bg-gray-300 text-gray-500 cursor-not-allowed"
                }`}
                disabled={connectionStatus.backend !== "online"}
                title={
                  connectionStatus.backend !== "online"
                    ? "Backend must be online to switch to live mode"
                    : ""
                }
              >
                {connectionStatus.backend === "online"
                  ? "Try Live Mode"
                  : "Backend Offline"}
              </button>
              <button
                onClick={handleDismiss}
                className={`text-sm ${config.textColor} hover:opacity-75 transition-opacity`}
              >
                Got it
              </button>
            </div>

            {/* Last health check info */}
            {connectionStatus.lastHealthCheck && (
              <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                Last checked:{" "}
                {new Date(
                  connectionStatus.lastHealthCheck,
                ).toLocaleTimeString()}
              </div>
            )}
          </div>
          <div className="flex-shrink-0">
            <button
              onClick={handleDismiss}
              className={`${config.iconColor} hover:opacity-75 transition-opacity`}
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DemoNotification;
