import React, { useState } from 'react';
import { usePathfinder } from '../context/CountryContext';
import { JourneyModal } from './JourneyModal';

export const PathfinderStatus: React.FC = () => {
    const { visitedCountries, getLevelInfo } = usePathfinder();
    const [showModal, setShowModal] = useState(false);

    const count = visitedCountries.length;
    const TOTAL_COUNTRIES = 195;
    const percentage = Math.round((count / TOTAL_COUNTRIES) * 100);
    const { name: levelName } = getLevelInfo();

    // Circular progress calculation
    const radius = 18;
    const circumference = 2 * Math.PI * radius;
    const strokeDashoffset = circumference - (percentage / 100) * circumference;

    // Simple level number mapping
    const levelNumber = levelName === "Wanderer" ? 0 :
        levelName === "Pathfinder" ? 1 :
            levelName === "Explorer" ? 2 :
                levelName === "Trailblazer" ? 3 :
                    levelName === "Voyager" ? 4 :
                        levelName === "Navigator" ? 5 : 6; // World Class

    return (
        <>
            <div
                onClick={() => setShowModal(true)}
                className="absolute bottom-3 left-1/2 -translate-x-1/2 z-10 bg-white rounded-full shadow-2xl py-1 px-2 flex items-center gap-6 min-w-[340px] cursor-pointer transition-transform"
            >
                {/* Level Indicator */}
                <div className="w-10 h-10 rounded-full bg-green-500 flex items-center justify-center text-white font-bold text-lg shrink-0 shadow-lg">
                    {levelNumber}
                </div>

                {/* Text Info */}
                <div className="flex flex-col flex-1 text-center">
                    <span className="text-gray-800 font-medium text-xl tracking-tight leading-tight">{levelName}</span>
                    <span className="text-gray-500 text-sm font-normal">{count} countries visited</span>
                </div>

                {/* Progress Circle */}
                <div className="relative w-10 h-10 flex items-center justify-center shrink-0">
                    <svg className="w-full h-full transform -rotate-90">
                        <circle
                            cx="20"
                            cy="20"
                            r="17"
                            stroke="#e5e7eb"
                            strokeWidth="2.5"
                            fill="transparent"
                        />
                        <circle
                            cx="20"
                            cy="20"
                            r="17"
                            stroke="#4b5563"
                            strokeWidth="2.5"
                            fill="transparent"
                            strokeDasharray={circumference}
                            strokeDashoffset={strokeDashoffset}
                            className="transition-all duration-1000 ease-out"
                            strokeLinecap="round"
                        />
                    </svg>
                    <span className="absolute text-[11px] font-semibold text-gray-700">{percentage}%</span>
                </div>
            </div>

            <JourneyModal isOpen={showModal} onClose={() => setShowModal(false)} />
        </>
    );
};
