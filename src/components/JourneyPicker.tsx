import { z } from 'zod';
import { useTamboThread } from '@tambo-ai/react';
import { Globe, BookOpen, Map, Drama, Compass, Star } from 'lucide-react';

export const JourneyPicker = () => {
    const { sendThreadMessage } = useTamboThread();

    const themes = [
        {
            icon: <Globe className="w-5 h-5" />,
            title: "Nature & Wildlife",
            description: "Explore natural wonders and diverse ecosystems"
        },
        {
            icon: <BookOpen className="w-5 h-5" />,
            title: "Historical Treasures",
            description: "Discover ancient civilizations and rich heritage"
        },
        {
            icon: <Map className="w-5 h-5" />,
            title: "Island Paradise",
            description: "Visit tropical islands and coastal havens"
        },
        {
            icon: <Drama className="w-5 h-5" />,
            title: "Cultural Immersion",
            description: "Experience diverse traditions and local customs"
        },
        {
            icon: <Compass className="w-5 h-5" />,
            title: "Adventure & Mountains",
            description: "Conquer peaks and explore rugged terrain"
        },
        {
            icon: <Star className="w-5 h-5" />,
            title: "Culinary Journey",
            description: "Taste world-famous cuisines and flavors"
        }
    ];

    const handleSelect = (title: string) => {
        sendThreadMessage(`I'd like to plan a journey with the theme: ${title}. Please suggest some countries to visit.`);
    };

    return (
        <div className="flex flex-col gap-3 w-full max-w-sm">
            <p className="text-sm text-gray-600 mb-2">
                Let's make this journey unique. To get started, could you pick a theme for your trip? Here are some options:
            </p>
            <div className="flex flex-col gap-2">
                {themes.map((theme, index) => (
                    <button
                        key={index}
                        onClick={() => handleSelect(theme.title)}
                        className="flex items-center gap-3 p-3 bg-gray-50 hover:bg-gray-100 rounded-xl text-left transition-colors border border-gray-100"
                    >
                        <div className="p-2 bg-white rounded-lg shadow-sm text-gray-700">
                            {theme.icon}
                        </div>
                        <div>
                            <div className="font-semibold text-gray-900 text-sm">{theme.title}</div>
                            <div className="text-xs text-gray-500">{theme.description}</div>
                        </div>
                    </button>
                ))}
            </div>
        </div>
    );
};

export const JourneyPickerSchema = z.object({});
