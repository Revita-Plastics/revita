import React, { createContext, useContext, useState } from 'react';
import { useContent } from './ContentContext';

const LanguageContext = createContext();

export function LanguageProvider({ children }) {
  // Default to Dutch 'nl'
  const [lang, setLang] = useState('nl');
  const { content } = useContent();

  const t = (path) => {
    // If content is not loaded yet, fallback or safe check
    const data = content || {};
    return path.split('.').reduce((obj, key) => obj?.[key], data[lang]) || path;
  };

  const toggleLang = () => {
    setLang(prev => prev === 'nl' ? 'en' : 'nl');
  };

  return (
    <LanguageContext.Provider value={{ lang, setLang, toggleLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export const useLanguage = () => useContext(LanguageContext);
