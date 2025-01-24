'use client';

import React, { createContext, useContext, useState, ReactNode } from "react";



// Define the type for the context value
type LayoutContextType = {
  mode: number;
  setMode: (mode: number) => void;
  params: (number|string)[];
  setParams: (params: (number|string)[]) => void;
};

// Create the context with a default value (undefined ensures it must be used within a provider)
const LayoutContext = createContext<LayoutContextType | undefined>(undefined);

// Custom hook to access the context
export const useLayoutContext = () => {
  const context = useContext(LayoutContext);
  if (!context) {
    throw new Error("useLayoutContext must be used within a LayoutProvider");
  }
  return context;
};

// Context provider component
export const LayoutProvider = ({ children }: { children: ReactNode }) => {
  const [mode, setMode] = useState(1);
  const [params, setParams] = useState<(number | string)[]>([50]);

  return (
    <LayoutContext.Provider value={{ mode, setMode, params, setParams }}>
      {children}
    </LayoutContext.Provider>
  );
};