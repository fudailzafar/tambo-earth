import { z } from 'zod';
export const LocationCard = ({ name, description, imageUrl, flag, points }: {
    name: string,
    description: string,
    imageUrl?: string,
    flag?: string,
    points?: string
}) => {
    console.log("LocationCard rendering:", name);
    return (
        <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 max-w-sm">
            <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                    {flag && <span className="text-4xl shadow-sm rounded overflow-hidden">{flag}</span>}
                    <div>
                        <h2 className="text-lg font-bold text-gray-900 leading-tight">{name}</h2>
                        {/* Placeholder for capital or region if needed, but for now just name */}
                    </div>
                </div>
                {points && (
                    <div className="bg-green-50 text-green-600 font-bold px-3 py-1 rounded-full text-xs">
                        {points}
                    </div>
                )}
            </div>

            {imageUrl && <img src={imageUrl} alt={name} className="w-full h-32 object-cover rounded-lg mb-3" />}

            <p className="text-sm text-gray-600 leading-relaxed">{description}</p>

            {/* Action buttons placeholder */}
            <div className="flex gap-4 mt-3 text-gray-400">
                <button className="hover:text-gray-600"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="14" height="14" x="8" y="8" rx="2" ry="2" /><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" /></svg></button>
                <button className="hover:text-gray-600"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M7 10v12" /><path d="M15 5.88 14 10h5.83a2 2 0 0 1 1.92 2.56l-2.33 8A2 2 0 0 1 17.5 22H4a2 2 0 0 1-2-2v-8a2 2 0 0 1 2-2h2.76a2 2 0 0 0 1.79-1.11L12 2h0a3.13 3.13 0 0 1 3 3.88Z" /></svg></button>
                <button className="hover:text-gray-600"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 14V2" /><path d="M9 18.12 10 14H4.17a2 2 0 0 1-1.92-2.56l2.33-8A2 2 0 0 1 6.5 2H20a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2h-2.76a2 2 0 0 0-1.79 1.11L12 22h0a3.13 3.13 0 0 1-3-3.88Z" /></svg></button>
            </div>
        </div>
    );
};

export const LocationCardSchema = z.object({
    name: z.string().describe("Name of the country or location"),
    description: z.string().optional().describe("A brief, engaging description of the country."),
    flag: z.string().optional().describe("The emoji flag of the country"),
    points: z.string().optional().describe("Gamified points, e.g. '+1 point'"),
    imageUrl: z.string().optional().describe("Image URL"),
});
