'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';

interface SettingsContextType {
  pushAlerts: boolean;
  setPushAlerts: (value: boolean) => void;
  emailAlerts: boolean;
  setEmailAlerts: (value: boolean) => void;
  decimalPrecision: number;
  setDecimalPrecision: (value: number) => void;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [pushAlerts, setPushAlerts] = useState(true);
  const [emailAlerts, setEmailAlerts] = useState(false);
  const [decimalPrecision, setDecimalPrecision] = useState(1);

  const value = {
    pushAlerts,
    setPushAlerts,
    emailAlerts,
    setEmailAlerts,
    decimalPrecision,
    setDecimalPrecision,
  };

  return (
    <SettingsContext.Provider value={value}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
}
