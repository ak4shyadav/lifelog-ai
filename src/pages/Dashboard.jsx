import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { StatCard, AICoach } from '../components';

const Dashboard = ({ onNavigate }) => {
    const { state, toggleTheme, getDayScore, addTask, toggleTask } = useApp();
    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
    const [newTask, setNewTask] = useState("");

    const today = new Date().toISOString().split('T')[0];

    // --- Stats Calculations ---
    const totalFocusMin = Math.round((state.focus.sessions.reduce((a, b) => a + b.duration, 0) +
        (state.focus.activeSession ? (Date.now() - state.focus.activeSession.startTime) : 0)) / 60000);

    const lastSleep = state.sleep.sessions[state.sleep.sessions.length - 1];
    let sleepText = "Not logged yet";
    let sleepStatus = "neutral";
    if (state.sleep.activeSession) {
        sleepText = "Currently sleeping...";
        sleepStatus = "active";
    } else if (lastSleep) {
        // Check if sleep ended today
        const sleepEndDate = new Date(lastSleep.endTime).toISOString().split('T')[0];
        if (sleepEndDate === today) {
            const hrs = Math.floor(lastSleep.duration / 3600000);
            const mins = Math.floor((lastSleep.duration % 3600000) / 60000);
            sleepText = `${hrs}h ${mins}m rest`;
            sleepStatus = "good";
        } else {
            sleepText = "No sleep logged";
        }
    }

    const habitCount = state.habits.filter(h => h.history[today]).length;
    const totalHabits = state.habits.length;

    const journalEntry = state.journal.find(j => j.date === today);
    const journalText = journalEntry ? "Reflected" : "Not written yet";

    const todaysTasks = state.tasks?.filter(t => t.date === today) || [];
    const openTasks = todaysTasks.filter(t => !t.completed).length;

    // --- Consistency Graph Data (Last 7 Days) ---
    const weekData = useMemo(() => {
        const data = [];
        for (let i = 6; i >= 0; i--) {
            const d = new Date();
            d.setDate(d.getDate() - i);
            const dateStr = d.toISOString().split('T')[0];
            data.push({
                date: dateStr,
                day: d.toLocaleDateString('en-US', { weekday: 'narrow' }),
                displayDate: d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
                score: getDayScore(dateStr)
            });
        }
        return data;
    }, [getDayScore, state]);

    const selectedScore = weekData.find(d => d.date === selectedDate)?.score || 0;
    const selectedDisplayDate = weekData.find(d => d.date === selectedDate)?.displayDate || "";

    // Generate SVG path for line graph
    const graphPoints = weekData.map((d, i) => {
        const x = (i / (weekData.length - 1)) * 100;
        const y = 100 - (d.score * 10); // Map 0-10 score to 100-0% height
        return `${x},${y}`;
    }).join(' ');

    const handleAddTask = (e) => {
        e.preventDefault();
        if (!newTask.trim()) return;
        addTask(newTask);
        setNewTask("");
    };

    return (
        <div className="min-h-screen p-6 pb-32 animate-in fade-in duration-700">
            {/* 1. Header with Theme Toggle */}
            <header className="flex justify-between items-start mb-8 mt-6">
                <div>
                    <h1 className="text-2xl font-black tracking-tight text-gray-900 dark:text-white/90">
                        Good {new Date().getHours() < 12 ? 'Morning' : new Date().getHours() < 18 ? 'Afternoon' : 'Evening'},
                    </h1>
                    <p className="text-sm text-gray-500 dark:text-white/40 font-medium">
                        Here is your daily flow.
                    </p>
                </div>
                <button
                    onClick={toggleTheme}
                    className="w-10 h-10 rounded-full bg-white dark:bg-white/10 shadow-lg dark:shadow-none border border-gray-100 dark:border-white/5 flex items-center justify-center transition-transform active:scale-95"
                >
                    <span className="text-xl">{state.theme === 'dark' ? '☀️' : '🌙'}</span>
                </button>
            </header>

            {/* 2. Consistency Flow Graph (Line Chart) */}
            <section className="mb-10 relative">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xs font-bold uppercase tracking-widest text-gray-500 dark:text-white/40">Consistency Flow</h2>
                    {selectedDate && (
                        <span className="text-xs font-bold text-orange-500 bg-orange-500/10 px-2 py-1 rounded-full">
                            {selectedDisplayDate}: {selectedScore}/10
                        </span>
                    )}
                </div>

                <div className="h-40 w-full bg-white dark:bg-white/5 backdrop-blur-xl rounded-3xl border border-gray-100 dark:border-white/5 p-6 shadow-xl shadow-indigo-500/5 dark:shadow-none relative overflow-hidden group">
                    {/* Grid lines */}
                    <div className="absolute inset-x-6 top-6 bottom-6 flex flex-col justify-between pointer-events-none">
                        <div className="border-t border-gray-100 dark:border-white/5 w-full"></div>
                        <div className="border-t border-dashed border-gray-200 dark:border-white/10 w-full"></div>
                        <div className="border-t border-gray-100 dark:border-white/5 w-full"></div>
                    </div>

                    {/* SVG Line */}
                    <svg className="w-full h-full visible overflow-visible" viewBox="0 0 100 100" preserveAspectRatio="none">
                        {/* Gradient Fill */}
                        <defs>
                            <linearGradient id="line-gradient" x1="0" x2="0" y1="0" y2="1">
                                <stop offset="0%" stopColor="rgba(249, 115, 22, 0.2)" />
                                <stop offset="100%" stopColor="rgba(249, 115, 22, 0)" />
                            </linearGradient>
                        </defs>
                        <path
                            d={`M 0,100 ${graphPoints.split(' ').map(p => 'L ' + p).join(' ')} L 100,100 Z`}
                            fill="url(#line-gradient)"
                            stroke="none"
                        />
                        <polyline
                            points={graphPoints}
                            fill="none"
                            stroke="#f97316"
                            strokeWidth="3"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            vectorEffect="non-scaling-stroke"
                        />

                        {/* Interactive Data Points */}
                        {weekData.map((d, i) => (
                            <circle
                                key={i}
                                cx={(i / (weekData.length - 1)) * 100}
                                cy={100 - (d.score * 10)}
                                r="4"
                                className="fill-white dark:fill-[#1a1a2e] stroke-orange-500 stroke-2 cursor-pointer transition-all hover:r-6 hover:stroke-[3px]"
                                onClick={() => setSelectedDate(d.date)}
                            />
                        ))}
                    </svg>

                    {/* X-Axis Labels */}
                    <div className="absolute bottom-2 left-6 right-6 flex justify-between text-[10px] text-gray-400 dark:text-white/30 font-medium">
                        {weekData.map((d, i) => (
                            <span key={i}>{d.day}</span>
                        ))}
                    </div>
                </div>
            </section>

            {/* 3. Today Overview (New Section) */}
            <section className="mb-8">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Today</h2>
                <div className="bg-white dark:bg-[#151520] rounded-3xl p-5 border border-gray-100 dark:border-white/5 space-y-3 shadow-sm">
                    {/* Sleep Row */}
                    <div onClick={() => onNavigate('sleep')} className="flex items-center justify-between p-2 hover:bg-gray-50 dark:hover:bg-white/5 rounded-xl transition-colors cursor-pointer">
                        <div className="flex items-center gap-3">
                            <div className={`w-2 h-2 rounded-full ${sleepText.includes('h') ? 'bg-blue-500' : 'bg-gray-300 dark:bg-white/20'}`} />
                            <span className="text-sm font-medium text-gray-700 dark:text-white/80">Sleep</span>
                        </div>
                        <span className="text-sm text-gray-500 dark:text-white/50">{sleepText}</span>
                    </div>

                    {/* Focus Row */}
                    <div onClick={() => onNavigate('focus')} className="flex items-center justify-between p-2 hover:bg-gray-50 dark:hover:bg-white/5 rounded-xl transition-colors cursor-pointer">
                        <div className="flex items-center gap-3">
                            <div className={`w-2 h-2 rounded-full ${totalFocusMin > 0 ? 'bg-emerald-500' : 'bg-gray-300 dark:bg-white/20'}`} />
                            <span className="text-sm font-medium text-gray-700 dark:text-white/80">Focus</span>
                        </div>
                        <span className="text-sm text-gray-500 dark:text-white/50">{totalFocusMin}m logged</span>
                    </div>

                    {/* Habits Row */}
                    <div onClick={() => onNavigate('habits')} className="flex items-center justify-between p-2 hover:bg-gray-50 dark:hover:bg-white/5 rounded-xl transition-colors cursor-pointer">
                        <div className="flex items-center gap-3">
                            <div className={`w-2 h-2 rounded-full ${habitCount > 0 ? 'bg-orange-500' : 'bg-gray-300 dark:bg-white/20'}`} />
                            <span className="text-sm font-medium text-gray-700 dark:text-white/80">Habits</span>
                        </div>
                        <span className="text-sm text-gray-500 dark:text-white/50">{habitCount} / {totalHabits} done</span>
                    </div>

                    {/* Journal Row */}
                    <div onClick={() => onNavigate('journal')} className="flex items-center justify-between p-2 hover:bg-gray-50 dark:hover:bg-white/5 rounded-xl transition-colors cursor-pointer">
                        <div className="flex items-center gap-3">
                            <div className={`w-2 h-2 rounded-full ${journalEntry ? 'bg-purple-500' : 'bg-gray-300 dark:bg-white/20'}`} />
                            <span className="text-sm font-medium text-gray-700 dark:text-white/80">Journal</span>
                        </div>
                        <span className="text-sm text-gray-500 dark:text-white/50">{journalText}</span>
                    </div>
                </div>
            </section>

            {/* 4. Today's Tasks Component */}
            <section className="mb-10">
                <h2 className="text-sm font-bold text-gray-900 dark:text-white/90 mb-4 px-1">Checklist</h2>
                <div className="space-y-3">
                    {/* Input - Floating Style */}
                    <form onSubmit={handleAddTask} className="relative group">
                        <input
                            type="text"
                            value={newTask}
                            onChange={(e) => setNewTask(e.target.value)}
                            placeholder="Add a task for today..."
                            className="w-full bg-white dark:bg-[#1a1a2e] border-none shadow-sm rounded-2xl py-4 px-5 pl-12 text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all"
                        />
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-lg">+</span>
                    </form>

                    {/* Task List */}
                    <div className="space-y-2">
                        {todaysTasks.map(task => (
                            <div
                                key={task.id}
                                onClick={() => toggleTask(task.id)}
                                className={`flex items-center gap-4 p-4 rounded-2xl cursor-pointer transition-all duration-300 ${task.completed
                                        ? 'bg-gray-100/50 dark:bg-white/5 opacity-60 scale-[0.98]'
                                        : 'bg-white dark:bg-[#1a1a2e] shadow-sm hover:scale-[1.01]'
                                    }`}
                            >
                                <div className={`w-6 h-6 rounded-full border-[1.5px] flex items-center justify-center transition-colors ${task.completed
                                        ? 'bg-emerald-500 border-emerald-500'
                                        : 'border-gray-300 dark:border-white/20'
                                    }`}>
                                    {task.completed && <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>}
                                </div>
                                <span className={`flex-1 text-sm font-medium ${task.completed ? 'text-gray-500 line-through decoration-gray-400' : 'text-gray-800 dark:text-white/90'
                                    }`}>
                                    {task.text}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* 5. Connected Feature Cards (Grid) */}
            <section className="mb-12">
                <h2 className="text-sm font-bold text-gray-900 dark:text-white/90 mb-4 px-1">Details</h2>
                <div className="grid grid-cols-2 gap-3">
                    <StatCard
                        label="Sleep"
                        value={sleepText.length > 15 ? sleepText.split(' ')[0] + "h" : sleepText}
                        accentColor="blue"
                        active={!!state.sleep.activeSession}
                        onClick={() => onNavigate('sleep')}
                    />
                    <StatCard
                        label="Focus"
                        value={totalFocusMin + "m"}
                        accentColor="green"
                        active={!!state.focus.activeSession}
                        onClick={() => onNavigate('focus')}
                    />
                    <StatCard
                        label="Habits"
                        value={`${habitCount}/${totalHabits}`}
                        accentColor="orange"
                        onClick={() => onNavigate('habits')}
                    />
                    <StatCard
                        label="Journal"
                        value={journalEntry ? "Done" : "Empty"}
                        accentColor="purple"
                        onClick={() => onNavigate('journal')}
                    />
                </div>
            </section>

            {/* 6. AI Coach (Narrative) */}
            <AICoach />
        </div>
    );
};

export default Dashboard;
