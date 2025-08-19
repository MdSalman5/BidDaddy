// Responsive design utilities for consistent breakpoints across the app

export const breakpoints = {
  xs: "320px", // Extra small devices
  sm: "640px", // Small devices (phones)
  md: "768px", // Medium devices (tablets)
  lg: "1024px", // Large devices (desktops)
  xl: "1280px", // Extra large devices
  "2xl": "1536px", // 2X Large devices
};

export const responsiveClasses = {
  // Container classes
  container: {
    padding: "px-4 sm:px-6 lg:px-8",
    maxWidth: "max-w-7xl mx-auto",
    spacing: "space-y-6 sm:space-y-8",
  },

  // Grid layouts
  grid: {
    responsive2: "grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6",
    responsive3:
      "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6",
    responsive4:
      "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6",
    responsive6:
      "grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4",
  },

  // Typography
  typography: {
    h1: "text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold",
    h2: "text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold",
    h3: "text-lg sm:text-xl md:text-2xl font-semibold",
    h4: "text-base sm:text-lg md:text-xl font-semibold",
    body: "text-sm sm:text-base",
    caption: "text-xs sm:text-sm",
  },

  // Spacing
  spacing: {
    section: "py-8 sm:py-12 lg:py-16",
    card: "p-4 sm:p-6",
    element: "mb-4 sm:mb-6",
  },

  // Buttons
  button: {
    base: "px-4 sm:px-6 py-2 sm:py-3 text-sm sm:text-base font-medium rounded-lg transition-all duration-300",
    responsive:
      "inline-flex items-center justify-center min-w-[120px] sm:min-w-[140px]",
  },

  // Theme classes
  theme: {
    bg: "bg-white dark:bg-gray-900",
    bgAlt: "bg-gray-50 dark:bg-gray-800",
    card: "bg-white dark:bg-gray-800",
    border: "border-gray-200 dark:border-gray-700",
    text: "text-gray-900 dark:text-gray-100",
    textMuted: "text-gray-600 dark:text-gray-400",
    hover: "hover:bg-gray-50 dark:hover:bg-gray-700",
  },

  // Layout utilities
  layout: {
    flexResponsive: "flex flex-col sm:flex-row",
    stackOnMobile: "space-y-4 sm:space-y-0 sm:space-x-4",
    hideOnMobile: "hidden sm:block",
    showOnMobile: "block sm:hidden",
    centerContent: "flex items-center justify-center",
  },
};

// Helper function to combine responsive classes
export const combineClasses = (...classes) => {
  return classes.filter(Boolean).join(" ");
};

// Media query helpers for JavaScript
export const mediaQueries = {
  isMobile: () => window.innerWidth < 640,
  isTablet: () => window.innerWidth >= 640 && window.innerWidth < 1024,
  isDesktop: () => window.innerWidth >= 1024,
  isLargeScreen: () => window.innerWidth >= 1280,
};

// Responsive image sizes
export const imageSizes = {
  avatar: {
    sm: "w-8 h-8 sm:w-10 sm:h-10",
    md: "w-12 h-12 sm:w-14 sm:h-14",
    lg: "w-16 h-16 sm:w-20 sm:h-20",
  },
  card: {
    sm: "h-32 sm:h-40",
    md: "h-40 sm:h-48 md:h-56",
    lg: "h-48 sm:h-56 md:h-64 lg:h-72",
  },
};
