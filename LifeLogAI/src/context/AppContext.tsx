import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY = 'lifelog_v2_mobile_data';

export interface Habit {
    id: number;
    name: string;
    history: Record<string, boolean>;
}

export interface JournalEntry {
    id: number;
    date: string;
    text: string;
    emotion: string;
}

export interface Session {
    startTime: number;
    endTime: number;
    duration: number;
}

interface AppState {
    sleep: {
        activeSession: { startTime: number } | null;
        sessions: Session[];
    };
    focus: {
        activeSession: { startTime: number } | null;
        sessions: Session[];
    };
    habits: Habit[];
    journal: JournalEntry[];
    coachMessage: string;
}

const initialState: AppState = {
    sleep: { activeSession: null, sessions: [] },
    focus: { activeSession: null, sessions: [] },
    habits: [
        { id: 1, name: 'Morning Meditation', history: {} },
        { id: 2, name: 'Reading', history: {} },
    ],
    journal: [],
    coachMessage: "Welcome back. I am ready to track your journey today. ✨",
};

interface AppContextType {
    state: AppState;
    startSleep: () => void;
    stopSleep: () => void;
    startFocus: () => void;
    stopFocus: () => void;
    addHabit: (name: string) => void;
    toggleHabit: (id: number) => void;
    addJournalEntry: (text: string) => void;
    refreshCoach: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [state, setState] = useState<AppState>(initialState);
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        loadData();
    }, []);

    useEffect(() => {
        if (isLoaded) {
            AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(state));
        }
    }, [state, isLoaded]);

    const loadData = async () => {
        try {
            const saved = await AsyncStorage.getItem(STORAGE_KEY);
            if (saved) {
                setState(JSON.parse(saved));
            }
        } catch (e) {
            console.error('Failed to load data', e);
        } finally {
            setIsLoaded(true);
        }
    };

    const startSleep = () => {
        setState(prev => ({
            ...prev,
            sleep: { ...prev.sleep, activeSession: { startTime: Date.now() } }
        }));
    };

    const stopSleep = () => {
        setState(prev => {
            if (!prev.sleep.activeSession) return prev;
            const endTime = Date.now();
            const startTime = prev.sleep.activeSession.startTime;
            const duration = endTime - startTime;
            return {
                ...prev,
                sleep: {
                    activeSession: null,
                    sessions: [...prev.sleep.sessions, { startTime, endTime, duration }]
                }
            };
        });
    };

    const startFocus = () => {
        setState(prev => ({
            ...prev,
            focus: { ...prev.focus, activeSession: { startTime: Date.now() } }
        }));
    };

    const stopFocus = () => {
        setState(prev => {
            if (!prev.focus.activeSession) return prev;
            const endTime = Date.now();
            const startTime = prev.focus.activeSession.startTime;
            const duration = endTime - startTime;
            return {
                ...prev,
                focus: {
                    activeSession: null,
                    sessions: [...prev.focus.sessions, { startTime, endTime, duration }]
                }
            };
        });
    };

    const addHabit = (name: string) => {
        setState(prev => ({
            ...prev,
            habits: [...prev.habits, { id: Date.now(), name, history: {} }]
        }));
    };

    const toggleHabit = (id: number) => {
        const today = new Date().toISOString().split('T')[0];
        setState(prev => ({
            ...prev,
            habits: prev.habits.map(h => h.id === id ? {
                ...h,
                history: { ...h.history, [today]: !h.history[today] }
            } : h)
        }));
    };

    const addJournalEntry = (text: string) => {
        const emotions = ['Balanced', 'Motivated', 'Reflective', 'Tired', 'Neutral'];
        const entry: JournalEntry = {
            id: Date.now(),
            date: new Date().toISOString().split('T')[0],
            text,
            emotion: emotions[Math.floor(Math.random() * emotions.length)]
        };
        setState(prev => ({
            ...prev,
            journal: [entry, ...prev.journal]
        }));
    };

    const refreshCoach = useCallback(() => {
        const today = new Date().toISOString().split('T')[0];
        const totalFocusMs = state.focus.sessions.reduce((acc, s) => acc + s.duration, 0) +
            (state.focus.activeSession ? (Date.now() - state.focus.activeSession.startTime) : 0);
        const habitCompletion = state.habits.filter(h => h.history[today]).length;

        const templates = [
            `You've dedicated ${Math.round(totalFocusMs / 3600000 * 10) / 10} hours to concentration today.`,
            habitCompletion > 0 ? `You've checked off ${habitCompletion} habits. Beautiful consistency. ⚡` : "Taking it slow? That's okay too. Rest is productive.",
            state.journal.length > 0 ? "Your reflections have depth. It helps to clear the mind." : "Consider taking a moment to journal later.",
            " الجسم السليم في العقل السليم (A healthy body in a healthy mind). Keep going."
        ];

        const randomMsg = templates[Math.floor(Math.random() * templates.length)];
        const prefixes = ["I noticed that ", "Thinking about your day... ", "Hey, ", "Progress report: "];

        setState(prev => ({
            ...prev,
            coachMessage: prefixes[Math.floor(Math.random() * prefixes.length)] + randomMsg,
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

export const useApp = () => {
    const context = useContext(AppContext);
    if (!context) throw new Error('useApp must be used within an AppProvider');
    return context;
};
