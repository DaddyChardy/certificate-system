
import React, { createContext, useContext, ReactNode } from 'react';
import { Seminar, Attendee } from '../types';
import { useMockApi, UseMockApiReturn } from '../hooks/useMockApi';

const AppContext = createContext<UseMockApiReturn | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const api = useMockApi();
  return <AppContext.Provider value={api}>{children}</AppContext.Provider>;
};

export const useAppContext = (): UseMockApiReturn => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};
