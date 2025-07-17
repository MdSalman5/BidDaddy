import React, { createContext, useContext, useState, useEffect } from "react";

const SidebarContext = createContext({
  isOpen: true,
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
      const isMobile = window.innerWidth < 1024; // lg breakpoint
      // Start closed on mobile, open on desktop
      return !isMobile;
    }
    return true; // Default to open
  });

  useEffect(() => {
    const handleResize = () => {
      const isMobile = window.innerWidth < 1024;
      // Auto-close on mobile, but don't auto-open on desktop to preserve user choice
      if (isMobile && isOpen) {
        setIsOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [isOpen]);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
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
