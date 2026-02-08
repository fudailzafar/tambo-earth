import React, { useRef, useEffect } from "react";
import { useTamboThread, useTamboThreadInput } from "@tambo-ai/react";

const Suggestions: React.FC<{ onSelect: (text: string) => void }> = ({ onSelect }) => {
    const items = [
        { icon: "🧭", text: "Where haven't I been yet?" },
        { icon: "✨", text: "Guess the country" },
        { icon: "📍", text: "Plan a journey for us to go on" },
    ];

    return (
        <div className="flex flex-col gap-2 mb-4">
            <h3 className="text-xl font-bold mb-2 text-gray-800">Where should we visit next?</h3>
            {items.map((item, index) => (
                <button
                    key={index}
                    onClick={() => onSelect(item.text)}
                    className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 text-left transition-colors group"
                >
                    <span className="text-gray-500 group-hover:text-black transition-colors">{item.icon}</span>
                    <span className="text-gray-600 group-hover:text-black font-medium transition-colors">{item.text}</span>
                </button>
            ))}
        </div>
    );
};

export const ChatSidebar: React.FC = () => {
    const { thread } = useTamboThread();
    const { value, setValue, submit, isPending } = useTamboThreadInput();
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [thread.messages]);

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            submit();
        }
    };

    return (
        <div className="flex flex-col h-full bg-white p-6">
            <div className="flex-1 overflow-y-auto" ref={scrollRef}>
                {thread.messages.length === 0 ? (
                    <div className="h-full flex flex-col justify-end">
                        <Suggestions onSelect={(text) => {
                            setValue(text);
                            // setTimeout(() => submit(), 0); // Optional: auto-submit
                        }} />
                    </div>
                ) : (
                    <div className="flex flex-col gap-4 py-4">
                        {thread.messages.map((message) => (
                            <div key={message.id} className={`flex flex-col gap-1 ${message.role === 'user' ? 'items-end' : 'items-start'}`}>
                                <div
                                    className={`py-3 px-4 rounded-2xl max-w-[90%] text-sm leading-relaxed ${message.role === 'user'
                                        ? 'bg-black text-white rounded-br-none'
                                        : 'bg-gray-100 text-gray-800 rounded-bl-none'
                                        }`}
                                >
                                    {Array.isArray(message.content) ? (
                                        message.content.map((part, i) =>
                                            part.type === "text" ? <p key={i}>{part.text}</p> : null
                                        )
                                    ) : (
                                        <p>{String(message.content)}</p>
                                    )}
                                </div>
                                {message.renderedComponent && (
                                    <div className="mt-2 w-full">
                                        {message.renderedComponent}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Input Area */}
            <div className="mt-4">
                <div className="relative border border-gray-200 rounded-full px-4 py-3 flex items-center shadow-sm focus-within:ring-2 focus-within:ring-black/5 focus-within:border-black/20 transition-all bg-white">
                    <input
                        className="flex-1 bg-transparent border-none outline-none text-gray-900 placeholder-gray-400 text-sm"
                        placeholder="Where to?"
                        value={value}
                        onChange={(e) => setValue(e.target.value)}
                        onKeyDown={handleKeyDown}
                        disabled={isPending}
                    />
                    <button
                        onClick={() => submit()}
                        disabled={isPending || !value.trim()}
                        className="ml-2 bg-black text-white rounded-full p-2 hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isPending ? (
                            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        ) : (
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M5 12h14" />
                                <path d="m12 5 7 7-7 7" />
                            </svg>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
};
