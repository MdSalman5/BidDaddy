import React from "react";
import { Loader2 } from "lucide-react";

const LoadingSpinner = ({
  size = "md",
  fullScreen = false,
  text = "Loading...",
}) => {
  const sizeClasses = {
    sm: "w-4 h-4",
    md: "w-8 h-8",
    lg: "w-12 h-12",
    xl: "w-16 h-16",
  };

  const containerClass = fullScreen
    ? "fixed inset-0 bg-white dark:bg-gray-900 flex flex-col items-center justify-center z-50"
    : "flex flex-col items-center justify-center min-h-32 py-8";

  return (
    <div className={containerClass}>
      <Loader2
        className={`${sizeClasses[size]} text-blue-600 dark:text-blue-400 animate-spin`}
      />
      {text && (
        <p className="mt-3 text-sm text-gray-600 dark:text-gray-400">{text}</p>
      )}
    </div>
  );
};

export default LoadingSpinner;
