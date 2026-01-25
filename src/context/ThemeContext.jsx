import React, { createContext, useContext, useState, useEffect } from 'react';
import themeData from '../data/theme.json';

const ThemeContext = createContext();

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(themeData);

  useEffect(() => {
    // Apply CSS vars
    const root = document.documentElement;
    root.style.setProperty('--color-primary', theme.primary);
    root.style.setProperty('--color-bg', theme.background);
    root.style.setProperty('--radius', theme.radius);
    
    // Also derive hover/dark versions if possible, or just keep simple for now
    // A simple method to darken the primary color for hover effects
    root.style.setProperty('--color-primary-hover', adjustColor(theme.primary, -20));
  }, [theme]);
  
  // Helper to darken hex
  function adjustColor(color, amount) {
    return '#' + color.replace(/^#/, '').replace(/../g, color => ('0'+Math.min(255, Math.max(0, parseInt(color, 16) + amount)).toString(16)).substr(-2));
  }

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => useContext(ThemeContext);
