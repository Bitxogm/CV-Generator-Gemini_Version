// src/contexts/LanguageContext.tsx - CORREGIDO

import React, { createContext, useContext, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

type Language = 'es' | 'en';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string, options?: any) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { i18n, t } = useTranslation();

  const setLanguage = (lang: Language) => {
    i18n.changeLanguage(lang);
    localStorage.setItem('i18nextLng', lang);
  };

  const language = (i18n.language as Language) || 'es';

  // ✅ CORREGIDO: Ejecutar SOLO UNA VEZ al montar
  useEffect(() => {
    const savedLanguage = localStorage.getItem('i18nextLng') as Language;
    if (savedLanguage && (savedLanguage === 'es' || savedLanguage === 'en')) {
      i18n.changeLanguage(savedLanguage);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // ⬅️ Array vacío = solo se ejecuta al montar

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};