import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';

const Focus = ({ onBack }) => {
    const { state, startFocus, stopFocus } = useApp();
    const [timer, setTimer] = useState(0);

    useEffect(() => {
        let interval;
        if (state.focus.activeSession) {
            interval = setInterval(() => {
                setTimer(Date.now() - state.focus.activeSession.startTime);
            }, 1000);
        } else {
            setTimer(0);
        }
        return () => clearInterval(interval);
    }, [state.focus.activeSession]);

    const formatTime = (ms) => {
        const h = Math.floor(ms / 3600000);
        const m = Math.floor((ms % 3600000) / 60000);
        const s = Math.floor((ms % 60000) / 1000);
        return `${m}:${s < 10 ? '0' + s : s}`;
    };

    const progress = Math.min((timer / 3600000) * 100, 100);

    return (
        <div className="min-h-screen bg-[#0f0f1a] text-white p-6 animate-in fade-in slide-in-from-right duration-500">
            <button onClick={onBack} className="mb-8 text-emerald-400 font-bold flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
                Back
            </button>

            <div className="text-center mt-8">
                <h2 className="text-sm font-bold uppercase tracking-[0.2em] text-emerald-400/60 mb-2">Deep Work</h2>
                <h1 className="text-3xl font-bold mb-12">Focus Chamber</h1>

                <div className="relative w-64 h-64 mx-auto mb-16 flex items-center justify-center">
                    {/* Progress Ring */}
                    <svg className="absolute w-full h-full -rotate-90">
                        <circle cx="128" cy="128" r="100" className="stroke-[#1a1a2e]" strokeWidth="12" fill="none" />
                        <circle
                            cx="128" cy="128" r="100"
                            className="stroke-emerald-500 transition-all duration-500"
                            strokeWidth="12" fill="none"
                            strokeDasharray="628"
                            strokeDashoffset={628 - (6.28 * progress)}
                            strokeLinecap="round"
                        />
                    </svg>

                    <div className="text-center">
                        <p className="text-5xl font-bold tracking-tighter mb-1">{formatTime(timer)}</p>
                        <p className="text-[11px] uppercase tracking-widest text-[#5de4c7]/50 font-bold">Minutes</p>
                    </div>
                </div>

                <div className="space-y-4 px-4">
                    {!state.focus.activeSession ? (
                        <button
                            onClick={startFocus}
                            className="group relative w-full py-5 overflow-hidden rounded-2xl font-bold text-lg active:scale-95 transition-all"
                        >
                            <div className="absolute inset-0 bg-emerald-600 group-hover:bg-emerald-500 transition-colors" />
                            <span className="relative z-10">Start Deep Focus</span>
                        </button>
                    ) : (
                        <button
                            onClick={stopFocus}
                            className="w-full py-5 bg-[#1a1a2e] border-2 border-emerald-500/30 text-emerald-400 rounded-2xl font-bold text-lg active:scale-95 transition-transform"
                        >
                            End Session
                        </button>
                    )}
                </div>

                <div className="mt-16 grid grid-cols-2 gap-4">
                    <div className="p-4 bg-white/5 rounded-2xl border border-white/5">
                        <p className="text-[9px] uppercase tracking-widest text-white/30 font-bold mb-1">Total Today</p>
                        <p className="text-xl font-bold text-white/90">
                            {Math.round(state.focus.sessions.reduce((a, b) => a + b.duration, 0) / 60000)}m
                        </p>
                    </div>
                    <div className="p-4 bg-white/5 rounded-2xl border border-white/5">
                        <p className="text-[9px] uppercase tracking-widest text-white/30 font-bold mb-1">Sessions</p>
                        <p className="text-xl font-bold text-white/90">{state.focus.sessions.length}</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Focus;
