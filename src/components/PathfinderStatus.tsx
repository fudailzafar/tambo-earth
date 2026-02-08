import React from 'react';

export const PathfinderStatus: React.FC = () => {
    return (
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 bg-white rounded-full shadow-lg p-2 pl-2 pr-4 flex items-center gap-4 min-w-[300px]">
            {/* Level Indicator */}
            <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold shrink-0">
                2
            </div>

            {/* Text Info */}
            <div className="flex flex-col flex-1 text-center">
                <span className="text-gray-900 font-medium text-sm">Pathfinder</span>
                <span className="text-gray-500 text-xs">5 countries visited</span>
            </div>

            {/* Progress Circle */}
            <div className="relative w-10 h-10 flex items-center justify-center shrink-0">
                {/* Background circle */}
                <svg className="w-full h-full transform -rotate-90">
                    <circle
                        cx="20"
                        cy="20"
                        r="18"
                        stroke="currentColor"
                        strokeWidth="2"
                        fill="transparent"
                        className="text-gray-200"
                    />
                    {/* Progress circle */}
                    <circle
                        cx="20"
                        cy="20"
                        r="18"
                        stroke="currentColor"
                        strokeWidth="2"
                        fill="transparent"
                        strokeDasharray={2 * Math.PI * 18}
                        strokeDashoffset={2 * Math.PI * 18 * (1 - 0.03)}
                        className="text-gray-800"
                        strokeLinecap="round"
                    />
                </svg>
                <span className="absolute text-[10px] font-medium text-gray-700">3%</span>
            </div>
        </div>
    );
};
