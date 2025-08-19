import React, { useState, useEffect } from "react";
import { authService } from "../services/authService";
import {
  X,
  Info,
  Wifi,
  WifiOff,
  AlertTriangle,
} from "lucide-react";

const DemoNotification = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);

  useEffect(() => {
    const checkDemoMode = () => {
      const isDemoMode = authService.isDemoMode();
      const hasBeenDismissed = localStorage.getItem("demoNotificationDismissed") === "true";

      if (isDemoMode && !hasBeenDismissed) {
        setIsVisible(true);
      }
    };

    checkDemoMode();

    // Check for offline status
    const handleOffline = () => {
      localStorage.setItem("useDemoMode", "true");
      setIsVisible(true);
      setIsDismissed(false);
      localStorage.removeItem("demoNotificationDismissed");
    };

    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  const handleDismiss = () => {
    setIsVisible(false);
    setIsDismissed(true);
    localStorage.setItem("demoNotificationDismissed", "true");
  };

  const handleToggleDemoMode = () => {
    const currentMode = authService.isDemoMode();
    
    if (currentMode) {
      // Switching to live mode
      localStorage.removeItem("useDemoMode");
      setIsVisible(false);
      localStorage.removeItem("demoNotificationDismissed");
      window.location.reload();
    } else {
      // Switching to demo mode
      localStorage.setItem("useDemoMode", "true");
      setIsVisible(true);
      window.location.reload();
    }
  };

  const getDemoConfig = () => {
    const isOnline = navigator.onLine;
    
    if (!isOnline) {
      return {
        icon: WifiOff,
        bgColor: "bg-yellow-50 dark:bg-yellow-900/20",
        borderColor: "border-yellow-200 dark:border-yellow-800",
        iconColor: "text-yellow-600 dark:text-yellow-400",
        titleColor: "text-yellow-800 dark:text-yellow-300",
        textColor: "text-yellow-700 dark:text-yellow-400",
        title: "Offline Mode",
        message: "You're offline. Using demo data until connection is restored.",
        canToggle: false
      };
    }
    
    return {
      icon: Info,
      bgColor: "bg-blue-50 dark:bg-blue-900/20",
      borderColor: "border-blue-200 dark:border-blue-800",
      iconColor: "text-blue-600 dark:text-blue-400",
      titleColor: "text-blue-800 dark:text-blue-300",
      textColor: "text-blue-700 dark:text-blue-400",
      title: "Demo Mode Active",
      message: "You're using demo data with full functionality. Switch to live mode anytime.",
      canToggle: true
    };
  };

  if (!isVisible || isDismissed || !authService.isDemoMode()) {
    return null;
  }

  const config = getDemoConfig();
  const Icon = config.icon;

  return (
    <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 max-w-md w-full mx-4">
      <div className={`${config.bgColor} border ${config.borderColor} rounded-xl shadow-lg p-4 backdrop-blur-sm`}>
        <div className="flex items-start">
          <div className="flex-shrink-0">
            <Icon className={`h-6 w-6 ${config.iconColor}`} />
          </div>
          <div className="ml-3 flex-1">
            <div className="flex items-center justify-between mb-1">
              <h3 className={`text-sm font-semibold ${config.titleColor}`}>
                {config.title}
              </h3>
              <div className={`w-2 h-2 rounded-full ${navigator.onLine ? "bg-green-500" : "bg-red-500"}`} 
                   title={navigator.onLine ? "Online" : "Offline"}>
              </div>
            </div>
            <p className={`text-sm ${config.textColor} mb-3`}>
              {config.message}
            </p>
            <div className="flex items-center space-x-2">
              {config.canToggle && (
                <button
                  onClick={handleToggleDemoMode}
                  className="text-sm px-3 py-1 rounded-md bg-blue-600 hover:bg-blue-700 text-white transition-colors"
                >
                  Switch to Live Mode
                </button>
              )}
              <button
                onClick={handleDismiss}
                className={`text-sm ${config.textColor} hover:opacity-75 transition-opacity`}
              >
                Got it
              </button>
            </div>
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
