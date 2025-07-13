import React, { useState } from "react";
import { useTheme } from "../contexts/ThemeContext";
import { Sun, Moon, Monitor, ChevronDown, Check } from "lucide-react";

const ThemeToggle = ({ variant = "button", className = "" }) => {
  const { theme, setTheme, getEffectiveTheme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);

  const themes = [
    {
      value: "light",
      label: "Light",
      icon: Sun,
      description: "Bright and clean interface",
    },
    {
      value: "dark",
      label: "Dark",
      icon: Moon,
      description: "Easy on the eyes in low light",
    },
    {
      value: "system",
      label: "System",
      icon: Monitor,
      description: "Follows your system preference",
    },
  ];

  const currentTheme = themes.find((t) => t.value === theme);
  const effectiveTheme = getEffectiveTheme();

  if (variant === "simple") {
    return (
      <button
        onClick={() => setTheme(theme === "light" ? "dark" : "light")}
        className={`p-2 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-200 ${className}`}
        aria-label="Toggle theme"
      >
        {effectiveTheme === "dark" ? (
          <Sun className="w-5 h-5 text-yellow-500" />
        ) : (
          <Moon className="w-5 h-5 text-blue-600" />
        )}
      </button>
    );
  }

  if (variant === "dropdown") {
    return (
      <div className="relative">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={`flex items-center space-x-2 px-3 py-2 rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200 ${className}`}
          aria-label="Select theme"
        >
          <currentTheme.icon className="w-4 h-4" />
          <span className="text-sm font-medium">{currentTheme.label}</span>
          <ChevronDown
            className={`w-4 h-4 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
          />
        </button>

        {isOpen && (
          <>
            <div
              className="fixed inset-0 z-10"
              onClick={() => setIsOpen(false)}
              aria-hidden="true"
            />
            <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-gray-800 rounded-xl shadow-auction-lg border border-gray-200 dark:border-gray-700 py-2 z-20">
              {themes.map((themeOption) => {
                const Icon = themeOption.icon;
                const isSelected = theme === themeOption.value;

                return (
                  <button
                    key={themeOption.value}
                    onClick={() => {
                      setTheme(themeOption.value);
                      setIsOpen(false);
                    }}
                    className="w-full flex items-center space-x-3 px-4 py-3 text-left hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200"
                  >
                    <Icon className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                    <div className="flex-1">
                      <div className="font-medium text-gray-900 dark:text-gray-100">
                        {themeOption.label}
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        {themeOption.description}
                      </div>
                    </div>
                    {isSelected && (
                      <Check className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                    )}
                  </button>
                );
              })}
            </div>
          </>
        )}
      </div>
    );
  }

  // Default segmented control variant
  return (
    <div
      className={`inline-flex items-center bg-gray-100 dark:bg-gray-800 rounded-lg p-1 ${className}`}
    >
      {themes.map((themeOption) => {
        const Icon = themeOption.icon;
        const isSelected = theme === themeOption.value;

        return (
          <button
            key={themeOption.value}
            onClick={() => setTheme(themeOption.value)}
            className={`inline-flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
              isSelected
                ? "bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 shadow-sm"
                : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100"
            }`}
            aria-label={`Switch to ${themeOption.label.toLowerCase()} theme`}
          >
            <Icon className="w-4 h-4" />
            <span className="hidden sm:inline">{themeOption.label}</span>
          </button>
        );
      })}
    </div>
  );
};

export default ThemeToggle;
