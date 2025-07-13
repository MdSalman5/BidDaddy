import React, { useState, useEffect } from "react";
import { authService } from "../services/authService";
import { X, Info, Wifi, WifiOff } from "lucide-react";

const DemoNotification = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);

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

    // Check periodically for network changes
    const interval = setInterval(checkDemoMode, 5000);

    return () => clearInterval(interval);
  }, []);

  const handleDismiss = () => {
    setIsVisible(false);
    setIsDismissed(true);
    localStorage.setItem("demoNotificationDismissed", "true");
  };

  const handleToggleDemoMode = () => {
    const currentMode = authService.isDemoMode();
    authService.toggleDemoMode(!currentMode);

    if (!currentMode) {
      // Switching to demo mode
      setIsVisible(true);
    } else {
      // Switching to live mode
      setIsVisible(false);
      localStorage.removeItem("demoNotificationDismissed");
    }

    // Refresh the page to apply changes
    window.location.reload();
  };

  if (!isVisible || isDismissed) {
    return null;
  }

  return (
    <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 max-w-md w-full mx-4">
      <div className="bg-yellow-50 border border-yellow-200 rounded-xl shadow-lg p-4">
        <div className="flex items-start">
          <div className="flex-shrink-0">
            <WifiOff className="h-6 w-6 text-yellow-600" />
          </div>
          <div className="ml-3 flex-1">
            <h3 className="text-sm font-semibold text-yellow-800">
              Demo Mode Active
            </h3>
            <p className="text-sm text-yellow-700 mt-1">
              You're using demo data because the backend server is not
              connected. All features work with sample data.
            </p>
            <div className="mt-3 flex space-x-2">
              <button
                onClick={handleToggleDemoMode}
                className="text-sm bg-yellow-600 text-white px-3 py-1 rounded-md hover:bg-yellow-700 transition-colors"
              >
                Try Live Mode
              </button>
              <button
                onClick={handleDismiss}
                className="text-sm text-yellow-600 hover:text-yellow-800 transition-colors"
              >
                Got it
              </button>
            </div>
          </div>
          <div className="flex-shrink-0">
            <button
              onClick={handleDismiss}
              className="text-yellow-400 hover:text-yellow-600 transition-colors"
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
