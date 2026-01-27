import React from 'react';
import { useApp } from '../context/AppContext';

const AICoach = () => {
    const { state, refreshCoach } = useApp();

    return (
        <div className="relative group overflow-hidden rounded-2xl p-6 bg-gradient-to-br from-[#1e1e38] to-[#121225] border border-white/5 shadow-2xl">
            {/* Animated glow */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 blur-[60px] rounded-full -mr-10 -mt-10 group-hover:bg-indigo-500/20 transition-all duration-1000" />

            <div className="relative z-10">
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/20">
                            <span className="text-sm">✨</span>
                        </div>
                        <div>
                            <h3 className="text-sm font-bold text-white/90">AI Coach</h3>
                            <p className="text-[10px] text-white/30 uppercase tracking-[0.15em] font-medium">Assistant</p>
                        </div>
                    </div>

                    <button
                        onClick={refreshCoach}
                        className="p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors group/btn"
                        title="Refresh Insight"
                    >
                        <svg
                            className="w-4 h-4 text-white/40 group-hover/btn:rotate-180 transition-transform duration-500"
                            fill="none" viewBox="0 0 24 24" stroke="currentColor"
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                        </svg>
                    </button>
                </div>

                <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/5">
                    <p className="text-[13px] text-white/70 leading-relaxed font-medium italic">
                        "{state.coachMessage}"
                    </p>
                </div>
            </div>
        </div>
    );
};

export default AICoach;
