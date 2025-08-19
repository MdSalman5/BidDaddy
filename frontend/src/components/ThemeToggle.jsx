import React, { useState, useRef, useEffect } from "react";
import { useTheme } from "../contexts/ThemeContext";
import { Sun, Moon, Monitor, ChevronDown } from "lucide-react";

const ThemeToggle = ({ variant = "modern", className = "" }) => {
  const { theme, setTheme, getEffectiveTheme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const buttonRef = useRef(null);

  const themes = [
    {
      value: "light",
      label: "Light",
      icon: Sun,
      description: "Light mode",
    },
    {
      value: "dark",
      label: "Dark",
      icon: Moon,
      description: "Dark mode",
    },
    {
      value: "system",
      label: "System",
      icon: Monitor,
      description: "System preference",
    },
  ];

  const currentTheme = themes.find((t) => t.value === theme);
  const effectiveTheme = getEffectiveTheme();

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target) &&
        !buttonRef.current.contains(event.target)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Simple toggle variant
  if (variant === "simple") {
    return (
      <button
        onClick={() => setTheme(theme === "light" ? "dark" : "light")}
        className={`relative group inline-flex items-center justify-center w-10 h-10 rounded-xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50 hover:bg-gray-50 dark:hover:bg-gray-700/80 transition-all duration-300 shadow-sm hover:shadow-md ${className}`}
        aria-label="Toggle theme"
      >
        <div className="relative w-5 h-5">
          <Sun
            className={`absolute inset-0 w-5 h-5 text-amber-500 transition-all duration-500 ${effectiveTheme === "dark" ? "rotate-180 scale-0 opacity-0" : "rotate-0 scale-100 opacity-100"}`}
          />
          <Moon
            className={`absolute inset-0 w-5 h-5 text-blue-400 transition-all duration-500 ${effectiveTheme === "dark" ? "rotate-0 scale-100 opacity-100" : "-rotate-180 scale-0 opacity-0"}`}
          />
        </div>
      </button>
    );
  }

  // Modern dropdown variant (default)
  return (
    <div className={`relative ${className}`}>
      <button
        ref={buttonRef}
        onClick={() => setIsOpen(!isOpen)}
        className="group inline-flex items-center gap-2 px-3 py-2.5 text-sm font-medium rounded-xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700/80 transition-all duration-300 shadow-sm hover:shadow-md min-w-[120px]"
        aria-label="Select theme"
        aria-expanded={isOpen}
      >
        <div className="relative w-4 h-4 flex-shrink-0">
          {theme === "system" ? (
            <Monitor className="w-4 h-4 text-gray-500 dark:text-gray-400" />
          ) : (
            <>
              <Sun
                className={`absolute inset-0 w-4 h-4 text-amber-500 transition-all duration-500 ${effectiveTheme === "dark" ? "rotate-180 scale-0 opacity-0" : "rotate-0 scale-100 opacity-100"}`}
              />
              <Moon
                className={`absolute inset-0 w-4 h-4 text-blue-400 transition-all duration-500 ${effectiveTheme === "dark" ? "rotate-0 scale-100 opacity-100" : "-rotate-180 scale-0 opacity-0"}`}
              />
            </>
          )}
        </div>
        <span className="flex-1 text-left">{currentTheme.label}</span>
        <ChevronDown
          className={`w-4 h-4 text-gray-400 transition-transform duration-300 ${isOpen ? "rotate-180" : "rotate-0"}`}
        />
      </button>

      {/* Dropdown Menu */}
      <div
        ref={dropdownRef}
        className={`absolute left-0 top-full mt-2 w-56 bg-white/95 dark:bg-gray-800/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-gray-200/50 dark:border-gray-700/50 overflow-hidden transition-all duration-300 z-50 ${
          isOpen
            ? "opacity-100 scale-100 translate-y-0"
            : "opacity-0 scale-95 -translate-y-2 pointer-events-none"
        }`}
      >
        <div className="py-2">
          {themes.map((themeOption, index) => {
            const Icon = themeOption.icon;
            const isSelected = theme === themeOption.value;
            const isEffective =
              getEffectiveTheme() === themeOption.value &&
              themeOption.value !== "system";

            return (
              <button
                key={themeOption.value}
                onClick={() => {
                  setTheme(themeOption.value);
                  setIsOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-4 py-3 text-left transition-all duration-200 group ${
                  isSelected
                    ? "bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300"
                    : "text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700/50"
                }`}
              >
                <div className="relative w-5 h-5 flex-shrink-0">
                  {themeOption.value === "system" ? (
                    <Monitor
                      className={`w-5 h-5 transition-colors duration-200 ${isSelected ? "text-blue-600 dark:text-blue-400" : "text-gray-500 dark:text-gray-400"}`}
                    />
                  ) : themeOption.value === "light" ? (
                    <Sun
                      className={`w-5 h-5 transition-colors duration-200 ${isSelected ? "text-blue-600 dark:text-blue-400" : "text-amber-500"}`}
                    />
                  ) : (
                    <Moon
                      className={`w-5 h-5 transition-colors duration-200 ${isSelected ? "text-blue-600 dark:text-blue-400" : "text-blue-400"}`}
                    />
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div
                    className={`font-medium text-sm transition-colors duration-200 ${
                      isSelected
                        ? "text-blue-700 dark:text-blue-300"
                        : "text-gray-900 dark:text-gray-100"
                    }`}
                  >
                    {themeOption.label}
                  </div>
                  <div
                    className={`text-xs mt-0.5 transition-colors duration-200 ${
                      isSelected
                        ? "text-blue-600 dark:text-blue-400"
                        : "text-gray-500 dark:text-gray-400"
                    }`}
                  >
                    {themeOption.description}
                  </div>
                </div>

                {/* Selection indicator */}
                <div
                  className={`w-2 h-2 rounded-full transition-all duration-200 ${
                    isSelected
                      ? "bg-blue-600 dark:bg-blue-400 scale-100"
                      : isEffective
                        ? "bg-gray-400 dark:bg-gray-500 scale-75"
                        : "scale-0"
                  }`}
                />
              </button>
            );
          })}
        </div>

        {/* Bottom accent line */}
        <div className="h-1 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400" />
      </div>
    </div>
  );
};

export default ThemeToggle;
