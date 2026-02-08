import React, { createContext, useContext, useState, useEffect } from 'react';

export interface Country {
    name: string;
    code: string; // ISO 2-letter code
    lat?: number;
    lng?: number;
}

interface CountryContextType {
    visitedCountries: Country[];
    visitCountry: (country: Country) => void;
    isVisited: (countryName: string) => boolean;
    clearVisited: () => void;
    getLevelInfo: () => { name: string, nextThreshold: number | null, currentThreshold: number };
    targetCountry: string | null;
    flyToCountry: (countryName: string) => void;
}

const CountryContext = createContext<CountryContextType | undefined>(undefined);

export const PathfinderProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [visitedCountries, setVisitedCountries] = useState<Country[]>(() => {
        const saved = localStorage.getItem('chat-earth-visited-v2'); // New key for new format
        return saved ? JSON.parse(saved) : [];
    });

    useEffect(() => {
        localStorage.setItem('chat-earth-visited-v2', JSON.stringify(visitedCountries));
    }, [visitedCountries]);

    const visitCountry = (country: Country) => {
        setVisitedCountries(prev => {
            if (prev.some(c => c.name === country.name || c.code === country.code)) return prev;
            return [...prev, country];
        });
    };

    const isVisited = (countryName: string) => {
        return visitedCountries.some(c => c.name === countryName);
    };

    const clearVisited = () => {
        setVisitedCountries([]);
    };

    const getLevelInfo = () => {
        const count = visitedCountries.length;
        if (count >= 195) return { name: "World Class", nextThreshold: null, currentThreshold: 195 };
        if (count >= 85) return { name: "Navigator", nextThreshold: 195, currentThreshold: 85 };
        if (count >= 50) return { name: "Voyager", nextThreshold: 85, currentThreshold: 50 };
        if (count >= 25) return { name: "Trailblazer", nextThreshold: 50, currentThreshold: 25 };
        if (count >= 10) return { name: "Explorer", nextThreshold: 25, currentThreshold: 10 };
        if (count >= 3) return { name: "Pathfinder", nextThreshold: 10, currentThreshold: 3 };
        return { name: "Wanderer", nextThreshold: 3, currentThreshold: 0 };
    };

    const [targetCountry, setTargetCountry] = useState<string | null>(null);

    const flyToCountry = (countryName: string) => {
        setTargetCountry(countryName);
    };

    return (
        <CountryContext.Provider value={{ visitedCountries, visitCountry, isVisited, clearVisited, getLevelInfo, targetCountry, flyToCountry }}>
            {children}
        </CountryContext.Provider>
    );
};

export const usePathfinder = () => {
    const context = useContext(CountryContext);
    if (context === undefined) {
        throw new Error('usePathfinder must be used within a PathfinderProvider');
    }
    return context;
};
