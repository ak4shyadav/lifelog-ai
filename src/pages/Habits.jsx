import React, { useState } from 'react';
import { useApp } from '../context/AppContext';

const Habits = ({ onBack }) => {
    const { state, addHabit, toggleHabit } = useApp();
    const [newHabit, setNewHabit] = useState('');
    const today = new Date().toISOString().split('T')[0];

    const handleSubmit = (e) => {
        e.preventDefault();
        if (newHabit.trim()) {
            addHabit(newHabit.trim());
            setNewHabit('');
        }
    };

    const getStreak = (history) => {
        let streak = 0;
        const dates = Object.keys(history).sort().reverse();
        for (const d of dates) {
            if (history[d]) streak++;
            else break;
        }
        return streak;
    };

    return (
        <div className="min-h-screen bg-[#0f0f1a] text-white p-6 animate-in fade-in slide-in-from-right duration-500">
            <button onClick={onBack} className="mb-8 text-orange-400 font-bold flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
                Back
            </button>

            <header className="mb-10">
                <h1 className="text-3xl font-bold mb-2 tracking-tight">Daily Habits</h1>
                <p className="text-sm text-white/40">Small wins lead to big victories.</p>
            </header>

            <form onSubmit={handleSubmit} className="mb-10 relative">
                <input
                    type="text"
                    value={newHabit}
                    onChange={(e) => setNewHabit(e.target.value)}
                    placeholder="New habit name..."
                    className="w-full bg-[#1a1a2e] border-2 border-white/5 rounded-2xl py-4 px-6 focus:border-orange-500/50 focus:outline-none transition-colors pr-16 font-medium"
                />
                <button className="absolute right-3 top-3 h-10 w-10 bg-orange-500 rounded-xl flex items-center justify-center font-bold text-white shadow-lg shadow-orange-500/20 active:scale-90 transition-transform">+</button>
            </form>

            <div className="space-y-4">
                {state.habits.map(habit => {
                    const isDone = habit.history[today];
                    const streak = getStreak(habit.history);

                    return (
                        <div
                            key={habit.id}
                            onClick={() => toggleHabit(habit.id)}
                            className={`
                group relative flex items-center justify-between p-5 rounded-3xl border cursor-pointer transition-all duration-300
                ${isDone
                                    ? 'bg-orange-500/10 border-orange-500/30'
                                    : 'bg-[#1a1a2e] border-white/5 hover:border-white/10'
                                }
              `}
                        >
                            <div className="flex items-center gap-4">
                                <div className={`
                  w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-500
                  ${isDone ? 'bg-orange-500 rotate-[360deg]' : 'bg-white/5'}
                `}>
                                    {isDone ? (
                                        <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                                    ) : (
                                        <div className="w-2 h-2 rounded-full bg-white/20" />
                                    )}
                                </div>
                                <div>
                                    <p className={`font-bold transition-colors ${isDone ? 'text-white' : 'text-white/70'}`}>{habit.name}</p>
                                    <p className="text-[10px] uppercase font-extrabold tracking-widest text-white/30">{streak} Day Streak</p>
                                </div>
                            </div>

                            {isDone && (
                                <div className="text-[10px] font-bold text-orange-400 bg-orange-400/10 py-1 px-3 rounded-full animate-bounce">
                                    DONE
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default Habits;
