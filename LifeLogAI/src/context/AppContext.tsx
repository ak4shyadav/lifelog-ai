import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { colors, themes, ThemeType } from '../theme/colors';

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

export interface Task {
    id: number;
    text: string;
    completed: boolean;
    date: string;
}

export interface Session {
    startTime: number;
    endTime: number;
    duration: number;
    date: string;
}

interface AppState {
    theme: ThemeType;
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
    tasks: Task[];
    coachMessage: string;
}

const initialState: AppState = {
    theme: 'dark',
    sleep: { activeSession: null, sessions: [] },
    focus: { activeSession: null, sessions: [] },
    habits: [
        { id: 1, name: 'Morning Meditation', history: {} },
        { id: 2, name: 'Reading', history: {} },
    ],
    journal: [],
    tasks: [],
    coachMessage: "Welcome back. I am ready to track your journey today. ✨",
};

interface AppContextType {
    state: AppState;
    themeColors: typeof themes.dark;
    toggleTheme: () => void;
    startSleep: () => void;
    stopSleep: () => void;
    startFocus: () => void;
    stopFocus: () => void;
    addHabit: (name: string) => void;
    toggleHabit: (id: number) => void;
    deleteHabit: (id: number) => void;
    addTask: (text: string) => void;
    toggleTask: (id: number) => void;
    deleteTask: (id: number) => void;
    addJournalEntry: (text: string) => void;
    deleteJournalEntry: (id: number) => void;
    refreshCoach: () => void;
    getConsistencyData: () => { date: string; score: number }[];
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
                const parsed = JSON.parse(saved);
                setState({ ...initialState, ...parsed });
            }
        } catch (e) {
            console.error('Failed to load data', e);
        } finally {
            setIsLoaded(true);
        }
    };

    const toggleTheme = () => {
        setState(prev => ({
            ...prev,
            theme: prev.theme === 'dark' ? 'light' : 'dark'
        }));
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
            const date = new Date(startTime).toISOString().split('T')[0];
            return {
                ...prev,
                sleep: {
                    activeSession: null,
                    sessions: [...prev.sleep.sessions, { startTime, endTime, duration, date }]
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
            const date = new Date(startTime).toISOString().split('T')[0];
            return {
                ...prev,
                focus: {
                    activeSession: null,
                    sessions: [...prev.focus.sessions, { startTime, endTime, duration, date }]
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

    const addTask = (text: string) => {
        const today = new Date().toISOString().split('T')[0];
        setState(prev => ({
            ...prev,
            tasks: [...(prev.tasks || []), { id: Date.now(), text, completed: false, date: today }]
        }));
    };

    const toggleTask = (id: number) => {
        setState(prev => ({
            ...prev,
            tasks: (prev.tasks || []).map(t => t.id === id ? { ...t, completed: !t.completed } : t)
        }));
    };

    const deleteTask = (id: number) => {
        setState(prev => ({
            ...prev,
            tasks: (prev.tasks || []).filter(t => t.id !== id)
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

    const deleteHabit = (id: number) => {
        setState(prev => ({
            ...prev,
            habits: prev.habits.filter(h => h.id !== id)
        }));
    };

    const deleteJournalEntry = (id: number) => {
        setState(prev => ({
            ...prev,
            journal: prev.journal.filter(j => j.id !== id)
        }));
    };

    const getConsistencyData = useCallback(() => {
        const days = [];
        for (let i = 6; i >= 0; i--) {
            const d = new Date();
            d.setDate(d.getDate() - i);
            days.push(d.toISOString().split('T')[0]);
        }

        return days.map(date => {
            let score = 0;
            // Sleep
            const hasSleep = state.sleep.sessions.some(s => s.date === date);
            if (hasSleep) score += 1;

            // Focus
            const hasFocus = state.focus.sessions.some(s => s.date === date);
            if (hasFocus) score += 1;

            // Habits
            const habitsDone = state.habits.filter(h => h.history[date]).length;
            score += Math.min(habitsDone, 4);

            // Journal
            const hasJournal = state.journal.some(j => j.date === date);
            if (hasJournal) score += 1;

            // Tasks
            const dayTasks = state.tasks?.filter(t => t.date === date) || [];
            if (dayTasks.length > 0 && dayTasks.filter(t => t.completed).length >= dayTasks.length * 0.5) {
                score += 1;
            }

            return { date, score: Math.min(score, 10) };
        });
    }, [state]);

    const refreshCoach = useCallback(() => {
        const today = new Date().toISOString().split('T')[0];
        const dayData = getConsistencyData().find(d => d.date === today);
        const dayScore = dayData ? dayData.score : 0;

        const totalFocusMs = state.focus.sessions.filter(s => s.date === today).reduce((acc, s) => acc + s.duration, 0);
        const focusMin = Math.round(totalFocusMs / 60000);

        const habitsDone = state.habits.filter(h => h.history[today]).length;
        const totalHabits = state.habits.length;

        const tasksDone = state.tasks?.filter(t => t.date === today && t.completed).length || 0;

        let dayType = 'balanced';
        if (dayScore >= 6) dayType = 'high_performance';
        if (dayScore <= 2) dayType = 'low_activity';

        const intros: Record<string, string[]> = {
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

        const outros: Record<string, string> = {
            high_performance: "Keep this energy, but don't forget to rest.",
            balanced: "Consistency is the key, and you have it.",
            low_activity: "Tomorrow is a new canvas."
        };
        const outro = outros[dayType];

        let msg = `${intro} ${details.join(" ")} ${outro}`;
        if (details.length === 0) msg = `${intro} Specific actions are quiet, but your intention matters.`;

        msg = msg.replace(/\s+/g, ' ').trim();

        setState(prev => ({
            ...prev,
            coachMessage: msg,
        }));
    }, [state, getConsistencyData]);

    const themeColors = themes[state.theme];

    return (
        <AppContext.Provider value={{
            state,
            themeColors,
            toggleTheme,
            startSleep, stopSleep,
            startFocus, stopFocus,
            addHabit, toggleHabit, deleteHabit,
            addTask, toggleTask, deleteTask,
            addJournalEntry, deleteJournalEntry, refreshCoach,
            getConsistencyData
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
