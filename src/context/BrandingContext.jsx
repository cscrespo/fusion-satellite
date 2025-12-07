import React, { createContext, useContext, useState, useEffect } from 'react';

const BrandingContext = createContext();

const defaultBranding = {
    logoInternal: null,
    logoAuth: null,
    platformName: 'Bloom',
    tagline: 'Plataforma completa de gestão de saúde e nutrição',
    browserTitle: 'Bloom - Patient Tracking',
    colors: {
        primary: '#3b82f6',
        secondary: '#f3f4f6',
        accent: '#8b5cf6',
        success: '#10b981',
        warning: '#f59e0b',
        danger: '#ef4444',
    },
    favicon: null
};

export const BrandingProvider = ({ children }) => {
    const [branding, setBranding] = useState(defaultBranding);

    // Carregar do localStorage
    useEffect(() => {
        const saved = localStorage.getItem('platformBranding');
        if (saved) {
            try {
                const parsed = JSON.parse(saved);
                setBranding(parsed);
                applyBranding(parsed);
            } catch (error) {
                console.error('Error loading branding:', error);
            }
        }
    }, []);

    // Aplicar branding
    const applyBranding = (config) => {
        // Aplicar CSS variables
        const root = document.documentElement;
        Object.entries(config.colors).forEach(([key, value]) => {
            root.style.setProperty(`--color-${key}`, value);
        });

        // Atualizar título
        document.title = config.browserTitle;

        // Atualizar favicon
        if (config.favicon) {
            let link = document.querySelector("link[rel~='icon']");
            if (!link) {
                link = document.createElement('link');
                link.rel = 'icon';
                document.head.appendChild(link);
            }
            link.href = config.favicon;
        }
    };

    const updateBranding = (newConfig) => {
        const updated = { ...branding, ...newConfig };
        setBranding(updated);
        localStorage.setItem('platformBranding', JSON.stringify(updated));
        applyBranding(updated);
    };

    const resetBranding = () => {
        setBranding(defaultBranding);
        localStorage.removeItem('platformBranding');
        applyBranding(defaultBranding);
    };

    return (
        <BrandingContext.Provider value={{
            branding,
            updateBranding,
            resetBranding
        }}>
            {children}
        </BrandingContext.Provider>
    );
};

export const useBranding = () => {
    const context = useContext(BrandingContext);
    if (!context) {
        throw new Error('useBranding must be used within BrandingProvider');
    }
    return context;
};
