import React, { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export const ThemeProvider = ({ children }) => {
  // Always use light mode
  const [theme, setTheme] = useState('light');

  // Function to update theme (will always set to light)
  const updateTheme = (newTheme) => {
    // Force light mode regardless of input
    setTheme('light');
    localStorage.setItem('theme', 'light');
  };

  // Effect to ensure light mode is always applied
  useEffect(() => {
    // Always remove dark class to ensure light mode
    const root = window.document.documentElement;
    root.classList.remove('dark');
    
    // Set localStorage to light
    localStorage.setItem('theme', 'light');
  }, []);

  const value = {
    theme,
    updateTheme,
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};