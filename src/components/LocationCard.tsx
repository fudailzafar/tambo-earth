import { useState } from 'react';
import { z } from 'zod';
export const LocationCard = ({ name, description, imageUrl, flag, points }: {
    name?: string | null,
    description?: string | null,
    imageUrl?: string | null,
    flag?: string | null,
    points?: string | null
}) => {
    const [copied, setCopied] = useState(false);
    const displayName = name || "Location";

    const handleCopy = () => {
        const textToCopy = `${displayName}\n\n${description || ''}`;
        navigator.clipboard.writeText(textToCopy);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    console.log("LocationCard rendering:", displayName);
    return (
        <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 max-w-sm">
            <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                    {flag && <span className="text-4xl shadow-sm rounded overflow-hidden">{flag}</span>}
                    <div>
                        <h2 className="text-lg font-bold text-gray-900 leading-tight">{displayName}</h2>
                        {/* Placeholder for capital or region if needed, but for now just name */}
                    </div>

                </div>
                {points && (
                    <div className="bg-green-50 text-green-600 font-bold px-3 py-1 rounded-full text-xs">
                        {points}
                    </div>
                )}
            </div>

            {imageUrl && <img src={imageUrl} alt={displayName} className="w-full h-32 object-cover rounded-lg mb-3" />}

            {description && <p className="text-sm text-gray-600 leading-relaxed">{description}</p>}

            {/* Action buttons placeholder */}
            <div className="flex gap-4 mt-3 text-gray-400">
                <button
                    onClick={handleCopy}
                    className="hover:text-gray-600 transition-colors p-1 rounded-md hover:bg-gray-100"
                    title="Copy details"
                >
                    {copied ? (
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-green-500"><polyline points="20 6 9 17 4 12"></polyline></svg>
                    ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="14" height="14" x="8" y="8" rx="2" ry="2" /><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" /></svg>
                    )}
                </button>
            </div>
        </div>
    );
};

export const LocationCardSchema = z.object({
    name: z.any().describe("Name of the country or location"),
    description: z.any().describe("A brief, engaging description of the country."),
    flag: z.any().describe("The emoji flag of the country"),
    points: z.any().describe("Gamified points, e.g. '+1 point'"),
    imageUrl: z.any().describe("Image URL"),
});
