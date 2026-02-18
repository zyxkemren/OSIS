"use client"

import React, { createContext, useState, useContext } from "react";

interface SidebarContextProps {
  isSidebarClosed: boolean;
  setIsSidebarClosed: React.Dispatch<React.SetStateAction<boolean>>;
}

const SidebarContext = createContext<SidebarContextProps>({
  isSidebarClosed: false,
  setIsSidebarClosed: () => {},
});

export function SidebarProvider({ children }: { children: React.ReactNode }) {
  const [isSidebarClosed, setIsSidebarClosed] = useState(false);

  return (
    <SidebarContext.Provider value={{ isSidebarClosed, setIsSidebarClosed }}>
      {children}
    </SidebarContext.Provider>
  );
}

export function useSidebar() {
  return useContext(SidebarContext);
}
