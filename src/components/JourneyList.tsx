import { z } from 'zod';
import { Globe } from 'lucide-react';

interface Destination {
    country: string;
    region: string;
}

interface JourneyListProps {
    title?: string;
    destinations?: Destination[];
    description?: string;
    details?: string[];
}

import { usePathfinder } from '../context/CountryContext';

export const JourneyList = ({ title, destinations = [], description, details = [] }: JourneyListProps) => {
    const { flyToCountry } = usePathfinder();
    const displayTitle = title || "Journey";
    // Ensure destinations is an array
    const destinationsList = Array.isArray(destinations) ? destinations : [];
    const visitedCount = 0; // Defaulting to 0 for now as we don't have user state for this yet
    const totalCount = destinationsList.length;

    // Ensure details is an array
    const detailsList = Array.isArray(details) ? details : [];

    return (
        <div className="flex flex-col gap-4 w-full max-w-md bg-white rounded-xl">
            {/* Header */}
            <div className="flex items-center gap-2 text-gray-700 font-medium pb-2">
                <span>🗺️</span>
                <span>{displayTitle}: {visitedCount}/{totalCount} visited</span>
            </div>

            {/* Destinations List */}
            <div className="flex flex-col gap-2">
                {destinationsList.map((dest, index) => (
                    <div
                        key={index}
                        onClick={() => dest?.country && flyToCountry(dest.country)}
                        className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl cursor-pointer hover:bg-gray-100 transition-colors active:scale-95 duration-200"
                    >
                        <div className="p-2 bg-white rounded-lg shadow-sm text-gray-700">
                            <Globe className="w-5 h-5" />
                        </div>
                        <div>
                            <div className="font-semibold text-gray-900">{dest?.country || "Unknown Country"}</div>
                            <div className="text-xs text-gray-500">{dest?.region || ""}</div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Description */}
            {description && (
                <div className="text-gray-800 leading-relaxed">
                    {description}
                </div>
            )}

            {/* Detailed List */}
            {detailsList.length > 0 && (
                <div className="flex flex-col gap-3 mt-2">
                    {detailsList.map((detail, index) => (
                        <div key={index} className="flex gap-3 text-gray-700 leading-relaxed">
                            <span className="font-bold text-gray-400 select-none">{index + 1}.</span>
                            <span>{detail}</span>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

// Using specific types for better LLM adherence
export const JourneyListSchema = z.object({
    title: z.string().nullish().describe("Title of the journey, e.g. 'Culinary Journey'"),
    destinations: z.array(z.object({
        country: z.string().describe("Country name"),
        region: z.string().nullish().describe("Region or city within the country")
    })).nullish().describe("Array of objects with 'country' and 'region' properties"),
    description: z.string().nullish().describe("Introductory text describing the journey"),
    details: z.array(z.string()).nullish().describe("Array of strings, each describing a step of the journey or a destination in detail"),
});
