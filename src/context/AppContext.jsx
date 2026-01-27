import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
    // Persistence Loading
    const initialState = {
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
        ],
        journal: [
            { id: 1, date: '2024-01-26', text: 'Yesterday was quite calm. I felt focused.', emotion: 'Calm' }
        ],
        coachMessage: "Welcome back. I am ready to track your journey today. ✨",
        lastRefreshed: new Date().toISOString()
    };

    const [state, setState] = useState(() => {
        const saved = localStorage.getItem('lifelog_v2_data');
        return saved ? JSON.parse(saved) : initialState;
    });

    useEffect(() => {
        localStorage.setItem('lifelog_v2_data', JSON.stringify(state));
    }, [state]);

    // --- ACTIONS ---

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

    // AI Coach Logic
    const refreshCoach = useCallback(() => {
        const today = new Date().toISOString().split('T')[0];
        const totalFocusMs = state.focus.sessions.reduce((acc, s) => acc + s.duration, 0) +
            (state.focus.activeSession ? (Date.now() - state.focus.activeSession.startTime) : 0);
        const lastSleep = state.sleep.sessions[state.sleep.sessions.length - 1];
        const habitCompletion = state.habits.filter(h => h.history[today]).length;
        const recentJournal = state.journal[0]?.text || "";

        const templates = [
            `You've dedicated ${Math.round(totalFocusMs / 3600000 * 10) / 10} hours to deep work today. That's a solid commitment to your goals.`,
            habitCompletion > 0 ? `You've checked off ${habitCompletion} habits already. Consistency is your superpower. ⚡` : "Taking it slow today? That's okay too. Small steps still count.",
            recentJournal.length > 5 ? "Your reflections show a lot of depth. It helps to clear the mind like that." : "Consider taking a moment to journal later; it might help you find some quiet.",
            lastSleep ? `Your last sleep session was ${Math.round(lastSleep.duration / 3600000 * 10) / 10} hours. Quality rest makes everything else easier.` : "Keep an eye on your rest—body and mind need that reset button."
        ];

        const randomMsg = templates[Math.floor(Math.random() * templates.length)];
        const supportivePrefixes = ["I noticed that ", "Thinking about your day... ", "Hey, ", "Progress report: "];

        setState(prev => ({
            ...prev,
            coachMessage: supportivePrefixes[Math.floor(Math.random() * supportivePrefixes.length)] + randomMsg,
            lastRefreshed: new Date().toISOString()
        }));
    }, [state.focus, state.sleep, state.habits, state.journal]);

    return (
        <AppContext.Provider value={{
            state,
            startSleep, stopSleep,
            startFocus, stopFocus,
            addHabit, toggleHabit,
            addJournalEntry, refreshCoach
        }}>
            {children}
        </AppContext.Provider>
    );
};

export const useApp = () => useContext(AppContext);
