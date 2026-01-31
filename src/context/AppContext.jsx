import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
    // Persistence Loading
    const initialState = {
        theme: 'dark', // 'dark' | 'light'
        sleep: {
            activeSession: null, // { startTime }
            sessions: [], // { startTime, endTime, duration }
        },
        focus: {
            activeSession: null, // { startTime }
            sessions: [], // { startTime, endTime, duration }
        },
        habits: [
            { id: 1, name: 'Morning Meditation', history: {} }, // history: { '2024-01-27': true }
            { id: 2, name: 'Reading', history: {} },
            { id: 3, name: 'Exercise', history: {} },
        ],
        journal: [],
        tasks: [], // { id, text, completed, date }
        coachMessage: "Welcome back. I see you.",
        lastRefreshed: new Date().toISOString()
    };

    const [state, setState] = useState(() => {
        try {
            const saved = localStorage.getItem('lifelog_v2_data');
            // Merge saved with initialState to ensure new keys (theme, tasks) exist
            return saved ? { ...initialState, ...JSON.parse(saved) } : initialState;
        } catch (e) {
            return initialState;
        }
    });

    useEffect(() => {
        localStorage.setItem('lifelog_v2_data', JSON.stringify(state));
    }, [state]);

    // --- ACTIONS ---

    // Theme
    const toggleTheme = () => {
        setState(prev => ({ ...prev, theme: prev.theme === 'dark' ? 'light' : 'dark' }));
    };

    // Sleep
    const startSleep = () => {
        setState(prev => ({
            ...prev,
            sleep: { ...prev.sleep, activeSession: { startTime: Date.now() } }
        }));
    };

    const stopSleep = () => {
        if (!state.sleep.activeSession) return;
        const endTime = Date.now();
        const startTime = state.sleep.activeSession.startTime;
        const duration = endTime - startTime;
        setState(prev => ({
            ...prev,
            sleep: {
                activeSession: null,
                sessions: [...prev.sleep.sessions, { startTime, endTime, duration }]
            }
        }));
    };

    // Focus
    const startFocus = () => {
        setState(prev => ({
            ...prev,
            focus: { ...prev.focus, activeSession: { startTime: Date.now() } }
        }));
    };

    const stopFocus = () => {
        if (!state.focus.activeSession) return;
        const endTime = Date.now();
        const startTime = state.focus.activeSession.startTime;
        const duration = endTime - startTime;
        setState(prev => ({
            ...prev,
            focus: {
                activeSession: null,
                sessions: [...prev.focus.sessions, { startTime, endTime, duration }]
            }
        }));
    };

    // Habits
    const addHabit = (name) => {
        setState(prev => ({
            ...prev,
            habits: [...prev.habits, { id: Date.now(), name, history: {} }]
        }));
    };

    const toggleHabit = (id) => {
        const today = new Date().toISOString().split('T')[0];
        setState(prev => ({
            ...prev,
            habits: prev.habits.map(h => h.id === id ? {
                ...h,
                history: { ...h.history, [today]: !h.history[today] }
            } : h)
        }));
    };

    // Tasks (Today's Checklist)
    const addTask = (text) => {
        const today = new Date().toISOString().split('T')[0];
        setState(prev => ({
            ...prev,
            tasks: [...prev.tasks, { id: Date.now(), text, completed: false, date: today }]
        }));
    };

    const toggleTask = (id) => {
        setState(prev => ({
            ...prev,
            tasks: prev.tasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t)
        }));
    };

    // Journal
    const addJournalEntry = (text) => {
        const entry = {
            id: Date.now(),
            date: new Date().toISOString().split('T')[0],
            text,
            emotion: detectEmotion(text)
        };
        setState(prev => ({
            ...prev,
            journal: [entry, ...prev.journal]
        }));
    };

    const detectEmotion = (text) => {
        const keywords = {
            Balanced: ['calm', 'peace', 'quiet', 'okay', 'steady'],
            Motivated: ['excited', 'ready', 'great', 'energy', 'focus', 'momentum'],
            Reflective: ['think', 'remember', 'wonder', 'feeling', 'slow'],
            Tired: ['exhausted', 'sleepy', 'weak', 'long day', 'hard']
        };
        for (const [emotion, words] of Object.entries(keywords)) {
            if (words.some(w => text.toLowerCase().includes(w))) return emotion;
        }
        return 'Neutral';
    };

    // Consistency Logic
    const getDayScore = useCallback((dateStr) => {
        // Simple scoring out of 10
        // Habits: up to 4 points
        // Focus: > 15m (2 pts), > 45m (3 pts)
        // Sleep: > 5h (2 pts)
        // Tasks: > 50% (1 pt)

        // 1. Habits
        const dayHabits = state.habits.filter(h => h.history[dateStr]);
        const habitScore = Math.min((dayHabits.length / Math.max(state.habits.length, 1)) * 4, 4);

        // 2. Focus
        const dayFocus = state.focus.sessions.filter(s =>
            new Date(s.startTime).toISOString().split('T')[0] === dateStr
        ).reduce((acc, s) => acc + s.duration, 0) / 60000; // minutes

        let focusScore = 0;
        if (dayFocus > 45) focusScore = 3;
        else if (dayFocus > 15) focusScore = 2;
        else if (dayFocus > 0) focusScore = 1;

        // 3. Sleep
        const daySleep = state.sleep.sessions.filter(s =>
            new Date(s.endTime).toISOString().split('T')[0] === dateStr
        ).reduce((acc, s) => acc + s.duration, 0) / 3600000; // hours
        const sleepScore = daySleep > 5 ? 2 : (daySleep > 0 ? 1 : 0);

        // 4. Tasks
        const dayTasks = state.tasks?.filter(t => t.date === dateStr) || [];
        const tasksCompleted = dayTasks.filter(t => t.completed).length;
        const taskScore = dayTasks.length > 0 ? (tasksCompleted / dayTasks.length) * 1 : 0;

        return Math.min(Math.round((habitScore + focusScore + sleepScore + taskScore) * 10) / 10, 10);
    }, [state.habits, state.focus.sessions, state.sleep.sessions, state.tasks]);

    // AI Coach Logic (Narrative Mode)
    const refreshCoach = useCallback(() => {
        const today = new Date().toISOString().split('T')[0];
        const dayScore = getDayScore(today);

        // Gather Data
        const totalFocusMs = state.focus.sessions.filter(s =>
            new Date(s.startTime).toISOString().split('T')[0] === today
        ).reduce((acc, s) => acc + s.duration, 0);
        const focusMin = Math.round(totalFocusMs / 60000);

        const habitsDone = state.habits.filter(h => h.history[today]).length;
        const totalHabits = state.habits.length;

        const tasksDone = state.tasks?.filter(t => t.date === today && t.completed).length || 0;

        // Determine "Day Type"
        let dayType = 'balanced';
        if (dayScore > 7) dayType = 'high_performance';
        if (dayScore < 3) dayType = 'low_activity';

        // Construct Narrative
        const intros = {
            high_performance: ["You're moving with serious momentum today.", "Today is one of those days where everything clicks.", "Strong flow today."],
            balanced: ["You're finding a good rhythm.", "Steady progress today.", "A balanced approach to the day."],
            low_activity: ["Taking it slow is part of the process.", "A quieter day today, and that's okay.", "Rest and reflection are just as important as action."]
        };
        const intro = intros[dayType][Math.floor(Math.random() * intros[dayType].length)];

        let details = [];
        if (focusMin > 30) details.push(`You've dedicated ${focusMin} minutes to deep work.`);
        if (habitsDone === totalHabits && totalHabits > 0) details.push("You've built a perfect habit streak.");
        else if (habitsDone > 0) details.push(`You showed up for ${habitsDone} habits.`);

        if (tasksDone > 0) details.push(`You crossed ${tasksDone} tasks off your list.`);

        const outros = {
            high_performance: "Keep this energy, but don't forget to rest.",
            balanced: "Consistency is the key, and you have it.",
            low_activity: "Tomorrow is a new canvas."
        };
        const outro = outros[dayType];

        let msg = `${intro} ${details.join(" ")} ${outro}`;
        if (details.length === 0) msg = `${intro} Specific actions are quiet, but your intention matters.`;

        // Clean up double spaces
        msg = msg.replace(/\s+/g, ' ').trim();

        setState(prev => ({
            ...prev,
            coachMessage: msg,
            lastRefreshed: new Date().toISOString()
        }));
    }, [getDayScore, state.focus.sessions, state.habits, state.tasks]);

    return (
        <AppContext.Provider value={{
            state,
            toggleTheme,
            startSleep, stopSleep,
            startFocus, stopFocus,
            addHabit, toggleHabit,
            addTask, toggleTask,
            addJournalEntry, refreshCoach,
            getDayScore
        }}>
            {children}
        </AppContext.Provider>
    );
};

export const useApp = () => useContext(AppContext);
