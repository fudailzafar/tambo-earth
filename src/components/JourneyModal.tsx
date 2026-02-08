import React, { useState, useRef, useEffect } from 'react';
import { usePathfinder } from '../context/CountryContext';
import { getViewer } from '../tools/globeViewerRef';

interface JourneyModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export const JourneyModal: React.FC<JourneyModalProps> = ({ isOpen, onClose }) => {
    const { visitedCountries, clearVisited, getLevelInfo } = usePathfinder();
    const [showMenu, setShowMenu] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);

    // Close menu when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setShowMenu(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    if (!isOpen) return null;

    const totalCountries = 195;
    const count = visitedCountries.length;

    const { name: levelName, nextThreshold } = getLevelInfo();
    const nextLevelCount = nextThreshold ? nextThreshold - count : 0;
    // Simple level number for display (1-4 based on the 4 tiers)
    const levelNumber = levelName === "Wanderer" ? 0 :
        levelName === "Pathfinder" ? 1 :
            levelName === "Explorer" ? 2 :
                levelName === "Trailblazer" ? 3 :
                    levelName === "Voyager" ? 4 :
                        levelName === "Navigator" ? 5 : 6; // World Class

    const handleReset = () => {
        clearVisited();
        setShowMenu(false);
    };

    const handleCountryClick = (country: any) => {
        if (country.lat && country.lng) {
            const viewer = getViewer();
            if (viewer) {
                viewer.pointOfView({ lat: country.lat, lng: country.lng, altitude: 0.6 }, 1500);
                onClose();
            }
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm" onClick={onClose}>
            <div className="bg-white rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-200" onClick={e => e.stopPropagation()}>

                {/* Header */}
                <div className="flex items-center justify-between p-6 pb-2">
                    <div className="flex items-center gap-3">
                        <h2 className="text-2xl font-bold text-gray-900">Your Journey</h2>
                        <span className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-sm font-semibold">
                            {count}/{totalCountries}
                        </span>
                    </div>

                    <div className="flex items-center gap-2">
                        {/* Menu Button */}
                        <div className="relative" ref={menuRef}>
                            <button
                                onClick={() => setShowMenu(!showMenu)}
                                className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-500"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="1" /><circle cx="19" cy="12" r="1" /><circle cx="5" cy="12" r="1" /></svg>
                            </button>

                            {showMenu && (
                                <div className="absolute right-0 top-full mt-2 bg-white rounded-xl shadow-xl border border-gray-100 p-2 z-10 min-w-[180px] flex gap-2">
                                    <button
                                        onClick={() => setShowMenu(false)}
                                        className="flex-1 px-4 py-2 text-sm text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg font-medium transition-colors"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={handleReset}
                                        className="flex-1 px-4 py-2 text-sm text-white bg-red-400 hover:bg-red-500 rounded-lg font-medium transition-colors"
                                    >
                                        Reset
                                    </button>
                                </div>
                            )}
                        </div>

                        {/* Close Button */}
                        <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-500">
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18" /><path d="m6 6 12 12" /></svg>
                        </button>
                    </div>
                </div>

                {/* Content */}
                <div className="p-6 pt-2 space-y-6">

                    {/* Level Card */}
                    <div className="bg-gray-50 rounded-2xl p-5 flex items-center gap-5">
                        <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg shadow-purple-500/20 text-white text-3xl font-bold shrink-0">
                            {levelNumber}
                        </div>
                        <div>
                            <div className="text-sm text-gray-500 font-medium mb-0.5">Current Level</div>
                            <div className="text-2xl font-bold text-gray-900 leading-none mb-1">{levelName}</div>
                            <div className="text-xs text-gray-400 font-medium">{nextLevelCount} to next level</div>
                        </div>
                    </div>

                    {/* Visited List Grid */}
                    <div className="grid grid-cols-2 gap-3 max-h-[350px] overflow-y-auto pr-1">
                        {visitedCountries.length === 0 ? (
                            <div className="col-span-2 text-center py-8 text-gray-400 text-sm italic">
                                Start exploring to add countries here...
                            </div>
                        ) : (
                            [...visitedCountries].sort((a, b) => a.name.localeCompare(b.name)).map((country, index) => (
                                <div
                                    key={index}
                                    onClick={() => handleCountryClick(country)}
                                    className="bg-gray-50 hover:bg-gray-100 transition-colors rounded-xl p-3 flex items-center gap-3 border border-transparent hover:border-gray-200 cursor-pointer"
                                >
                                    <div className="w-8 h-6 bg-gray-200 rounded overflow-hidden shadow-sm shrink-0">
                                        <img
                                            src={`https://flagcdn.com/w80/${country.code.toLowerCase()}.png`}
                                            alt={country.name}
                                            className="w-full h-full object-cover"
                                            onError={(e) => { (e.target as HTMLImageElement).src = 'https://flagcdn.com/w80/un.png' }}
                                        />
                                    </div>
                                    <span className="font-medium text-gray-800 text-sm truncate">{country.name}</span>
                                </div>
                            ))
                        )}
                    </div>

                </div>
            </div>
        </div>
    );
};
