import React, { createContext, useContext } from "react";

interface SidebarContextType {
  refreshSidebarCategories: () => void;
}

const SidebarContext = createContext<SidebarContextType | undefined>(undefined);

export const useSidebar = () => {
  const context = useContext(SidebarContext);
  if (!context) {
    throw new Error("useSidebar must be used within a SidebarProvider");
  }
  return context;
};

export const SidebarProvider: React.FC<{
  children: React.ReactNode;
  refreshSidebarCategories: () => void;
}> = ({ children, refreshSidebarCategories }) => (
  <SidebarContext.Provider value={{ refreshSidebarCategories }}>
    {children}
  </SidebarContext.Provider>
);
