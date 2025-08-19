import React, { createContext, useContext, useState, useEffect } from "react";

const SidebarContext = createContext({
  isOpen: false,
  setIsOpen: () => null,
  toggleSidebar: () => null,
});

export const useSidebar = () => {
  const context = useContext(SidebarContext);
  if (context === undefined) {
    throw new Error("useSidebar must be used within a SidebarProvider");
  }
  return context;
};

export function SidebarProvider({ children }) {
  const [isOpen, setIsOpen] = useState(() => {
    // Check if we're on mobile/tablet first
    if (typeof window !== "undefined") {
      const isDesktop = window.innerWidth >= 1024; // lg breakpoint

      // Get saved preference for desktop, default closed for mobile
      const savedPreference = localStorage.getItem("sidebarOpen");
      if (isDesktop && savedPreference !== null) {
        return savedPreference === "true";
      }

      // Default: closed on mobile, open on desktop
      return isDesktop;
    }
    return false; // Default to closed for SSR
  });

  useEffect(() => {
    const handleResize = () => {
      const isDesktop = window.innerWidth >= 1024;

      if (!isDesktop && isOpen) {
        // Auto-close on mobile
        setIsOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [isOpen]);

  const toggleSidebar = () => {
    const newState = !isOpen;
    setIsOpen(newState);

    // Save preference for desktop
    if (window.innerWidth >= 1024) {
      localStorage.setItem("sidebarOpen", newState.toString());
    }
  };

  const value = {
    isOpen,
    setIsOpen,
    toggleSidebar,
  };

  return (
    <SidebarContext.Provider value={value}>{children}</SidebarContext.Provider>
  );
}

export default SidebarContext;
