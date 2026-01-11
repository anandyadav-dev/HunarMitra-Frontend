import React, { createContext, useContext, useState, useEffect } from 'react';
import { translations } from '../utils/translations';

const LanguageContext = createContext({
    language: 'hi',
    setLanguage: () => { },
    toggleLanguage: () => { },
    t: (key) => key
});

export const LanguageProvider = ({ children }) => {
    const [language, setLanguage] = useState(() => {
        try {
            return localStorage.getItem('language') || 'hi';
        } catch (error) {
            console.warn('LocalStorage is not available:', error);
            return 'hi';
        }
    });

    useEffect(() => {
        try {
            localStorage.setItem('language', language);
        } catch (error) {
            console.warn('Failed to save language to localStorage:', error);
        }
    }, [language]);

    const toggleLanguage = () => {
        setLanguage(prev => prev === 'en' ? 'hi' : 'en');
    };

    const t = (key) => {
        return translations[language][key] || key;
    };

    return (
        <LanguageContext.Provider value={{ language, setLanguage, toggleLanguage, t }}>
            {children}
        </LanguageContext.Provider>
    );
};

export const useLanguage = () => useContext(LanguageContext);
