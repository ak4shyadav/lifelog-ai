import React from 'react';
import { useApp } from '../context/AppContext';
import { StatCard, AICoach } from '../components';

const Dashboard = ({ onNavigate }) => {
    const { state } = useApp();
    const today = new Date().toISOString().split('T')[0];

    // Logic for Dashboard display values
    const totalFocusMin = Math.round((state.focus.sessions.reduce((a, b) => a + b.duration, 0) +
        (state.focus.activeSession ? (Date.now() - state.focus.activeSession.startTime) : 0)) / 60000);

    const lastSleep = state.sleep.sessions[state.sleep.sessions.length - 1];
    const sleepDisplay = state.sleep.activeSession
        ? "Sleeping..."
        : (lastSleep ? `${Math.floor(lastSleep.duration / 3600000)}h ${Math.floor((lastSleep.duration % 3600000) / 60000)}m` : "Ready");

    const habitCount = state.habits.filter(h => h.history[today]).length;
    const journalState = state.journal.some(j => j.date === today) ? "Reflected" : "Write";

    return (
        <div className="min-h-screen bg-gradient-to-b from-[#0f0f1a] to-[#0a0a12] text-white p-6 pb-24 animate-in fade-in duration-700">
            {/* Header */}
            <header className="flex justify-between items-center mb-10 mt-6">
                <div>
                    <h1 className="text-2xl font-black tracking-tight text-white/90">LifeLog AI</h1>
                    <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-white/20 mt-1">Companion v2.0</p>
                </div>
                <div className="w-10 h-10 rounded-2xl bg-[#1a1a2e] border border-white/5 flex items-center justify-center">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                </div>
            </header>

            {/* Date */}
            <div className="mb-10">
                <p className="text-3xl font-bold tracking-tight">
                    {new Date().toLocaleDateString('en-US', { weekday: 'long' })},
                    <span className="text-white/30 ml-2">
                        {new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    </span>
                </p>
            </div>

            {/* Stats Stack */}
            <section className="space-y-4 mb-12">
                <StatCard
                    label="Sleep"
                    value={sleepDisplay}
                    accentColor="blue"
                    active={!!state.sleep.activeSession}
                    onClick={() => onNavigate('sleep')}
                />
                <StatCard
                    label="Focus"
                    value={`${totalFocusMin}m`}
                    accentColor="green"
                    active={!!state.focus.activeSession}
                    onClick={() => onNavigate('focus')}
                />
                <StatCard
                    label="Habits"
                    value={`${habitCount} / ${state.habits.length}`}
                    accentColor="orange"
                    onClick={() => onNavigate('habits')}
                />
                <StatCard
                    label="Journal"
                    value={journalState}
                    accentColor="purple"
                    onClick={() => onNavigate('journal')}
                />
            </section>

            {/* AI Coach */}
            <section className="mt-auto">
                <AICoach />
            </section>
        </div>
    );
};

export default Dashboard;
