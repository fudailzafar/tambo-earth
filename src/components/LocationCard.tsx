import React from 'react';
import { z } from 'zod';

export const LocationCard = ({ name, description, imageUrl }: { name: string, description: string, imageUrl?: string }) => {
    return (
        <div className="bg-black/60 backdrop-blur-md p-4 rounded-xl border border-white/20 text-white max-w-sm">
            {imageUrl && <img src={imageUrl} alt={name} className="w-full h-40 object-cover rounded-lg mb-3" />}
            <h2 className="text-xl font-bold mb-1">{name}</h2>
            <p className="text-sm text-gray-200">{description}</p>
        </div>
    );
};

export const LocationCardSchema = z.object({
    name: z.string().describe("Name of the location"),
    description: z.string().describe("Description of the location"),
    imageUrl: z.string().optional().describe("URL of an image of the location"),
});
