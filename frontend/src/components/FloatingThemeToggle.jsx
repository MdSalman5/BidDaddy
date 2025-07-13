import React from "react";
import ThemeToggle from "./ThemeToggle";

const FloatingThemeToggle = ({
  position = "top-right",
  className = "",
  variant = "simple",
}) => {
  const positionClasses = {
    "top-right": "top-6 right-6",
    "top-left": "top-6 left-6",
    "bottom-right": "bottom-6 right-6",
    "bottom-left": "bottom-6 left-6",
  };

  return (
    <div className={`fixed ${positionClasses[position]} z-50 ${className}`}>
      <div className="group">
        <ThemeToggle
          variant={variant}
          className="shadow-lg hover:shadow-xl transition-shadow duration-300"
        />
      </div>
    </div>
  );
};

export default FloatingThemeToggle;
