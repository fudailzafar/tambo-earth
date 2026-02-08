import { z } from 'zod';
import { Lightbulb, Sparkles } from 'lucide-react';

interface FunFactProps {
    fact: string;
    context?: string;
}

export const FunFact = ({ fact, context }: FunFactProps) => {
    return (
        <div className="relative group w-full max-w-md">
            <div className="absolute -inset-[1px] bg-gradient-to-r from-yellow-400 to-orange-500 rounded-2xl opacity-50 group-hover:opacity-100 transition duration-200"></div>
            <div className="relative bg-white rounded-xl p-4 shadow-sm">
                <div className="flex items-center gap-2 mb-2 text-yellow-600 font-bold uppercase tracking-wider text-xs">
                    <Sparkles className="w-4 h-4" />
                    <span>DID YOU KNOW?</span>
                </div>
                {context && (
                    <div className="text-xs text-gray-400 mb-2 font-medium">
                        Topic: {context}
                    </div>
                )}
                <div className="flex gap-3">
                    <div className="shrink-0 mt-1">
                        <div className="w-8 h-8 rounded-full bg-yellow-50 flex items-center justify-center text-yellow-600">
                            <Lightbulb className="w-5 h-5" />
                        </div>
                    </div>
                    <p className="text-gray-800 leading-relaxed font-medium">
                        {fact}
                    </p>
                </div>
            </div>
        </div>
    );
};

// Robust schema using z.any() as a fallback to ensure rendering, similar to other components
export const FunFactSchema = z.object({
    fact: z.any().describe("The fun fact text content"),
    context: z.any().describe("Optional context or category for the fact (e.g., 'History', 'Nature')"),
});
