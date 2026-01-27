import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';

const Sleep = ({ onBack }) => {
    const { state, startSleep, stopSleep } = useApp();
    const [timer, setTimer] = useState(0);

    useEffect(() => {
        let interval;
        if (state.sleep.activeSession) {
            interval = setInterval(() => {
                setTimer(Date.now() - state.sleep.activeSession.startTime);
            }, 1000);
        } else {
            setTimer(0);
        }
        return () => clearInterval(interval);
    }, [state.sleep.activeSession]);

    const formatTime = (ms) => {
        const h = Math.floor(ms / 3600000);
        const m = Math.floor((ms % 3600000) / 60000);
        const s = Math.floor((ms % 60000) / 1000);
        return `${h}h ${m}m ${s}s`;
    };

    const lastSession = state.sleep.sessions[state.sleep.sessions.length - 1];

    return (
        <div className="min-h-screen bg-[#0f0f1a] text-white p-6 animate-in fade-in slide-in-from-right duration-500">
            <button onClick={onBack} className="mb-8 text-blue-400 font-bold flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
                Back
            </button>

            <div className="text-center mt-12">
                <h2 className="text-sm font-bold uppercase tracking-[0.2em] text-blue-400/60 mb-2">Rest Companion</h2>
                <h1 className="text-3xl font-bold mb-12 italic">Sleep Cycle</h1>

                {state.sleep.activeSession ? (
                    <div className="relative inline-block">
                        <div className="absolute inset-0 bg-blue-500/20 blur-[80px] rounded-full" />
                        <div className="relative z-10 w-64 h-64 rounded-full border-2 border-blue-500/30 flex flex-col items-center justify-center mb-12 bg-[#1a1a2e]/80">
                            <p className="text-4xl font-bold tracking-tighter mb-2">{formatTime(timer)}</p>
                            <p className="text-[10px] uppercase tracking-widest text-white/40 font-bold">Dreaming...</p>
                        </div>
                    </div>
                ) : (
                    <div className="w-64 h-64 rounded-full border-2 border-white/5 mx-auto flex flex-col items-center justify-center mb-12 bg-[#1a1a2e]/50">
                        <p className="text-3xl font-bold text-white/20">Ready</p>
                    </div>
                )}

                <div className="space-y-4 px-4">
                    {!state.sleep.activeSession ? (
                        <button
                            onClick={startSleep}
                            className="w-full py-5 bg-blue-600 rounded-2xl font-bold text-lg shadow-xl shadow-blue-500/20 active:scale-95 transition-transform"
                        >
                            Start Sleep
                        </button>
                    ) : (
                        <button
                            onClick={stopSleep}
                            className="w-full py-5 bg-white text-black rounded-2xl font-bold text-lg shadow-xl active:scale-95 transition-transform"
                        >
                            Wake Up
                        </button>
                    )}
                </div>

                {lastSession && !state.sleep.activeSession && (
                    <div className="mt-12 p-6 bg-white/5 rounded-2xl border border-white/5 animate-in slide-in-from-bottom duration-700">
                        <p className="text-[10px] uppercase tracking-widest text-white/30 font-extrabold mb-1">Last Session</p>
                        <p className="text-2xl font-bold text-blue-400">
                            {Math.floor(lastSession.duration / 3600000)}h {Math.floor((lastSession.duration % 3600000) / 60000)}m
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Sleep;
