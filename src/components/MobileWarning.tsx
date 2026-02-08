import React from 'react';
import { Smartphone, Laptop, ArrowRight } from 'lucide-react';

export const MobileWarning: React.FC = () => {
    return (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#E0F2FE] p-4 text-center md:hidden">
            {/* Header / Back Arrow Placeholder */}
            <div className="absolute top-6 left-6 flex items-center gap-2">
                <img src="/octo-white-background-rounded.png" alt="Logo" className="w-6 h-6" />
                <span className="font-medium text-gray-800 text-lg">TamboEarth</span>
            </div>

            <div className="flex items-center gap-4 mb-8 text-gray-900">
                <Smartphone size={48} strokeWidth={1.5} />
                <ArrowRight size={24} strokeWidth={1.5} className="text-gray-500" />
                <Laptop size={48} strokeWidth={1.5} />
            </div>

            <h1 className="text-2xl font-bold text-gray-900 mb-2 max-w-xs">
                Your screen is too small for TamboEarth
            </h1>

            <p className="text-gray-600 max-w-sm">
                Make your window wider or open on desktop to continue
            </p>
        </div>
    );
};
