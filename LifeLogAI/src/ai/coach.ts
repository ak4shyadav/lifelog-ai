// AI Coach message generator (placeholder for future AI integration)

interface DailyStats {
    sleepHours: number;
    focusHours: number;
    habitsCompleted: number;
    habitsTotal: number;
    journalWritten: boolean;
}

const motivationalMessages = [
    "You showed good consistency today. Your focus hours improved — keep this momentum 🔥",
    "Great job on your sleep schedule! Rest is the foundation of productivity 💪",
    "You're building strong habits. Small steps lead to big changes ✨",
    "Your journal entries show real self-awareness. Keep reflecting 📝",
    "Impressive focus today! You're mastering your attention 🎯",
    "Balance is key, and you're finding it. Keep up the great work 🌟",
];

export const generateCoachMessage = (stats?: DailyStats): string => {
    // For now, return a random motivational message
    // In the future, this could use AI to generate personalized messages
    if (!stats) {
        return motivationalMessages[0];
    }

    // Simple logic-based message selection
    if (stats.focusHours >= 4) {
        return "You showed good consistency today. Your focus hours improved — keep this momentum 🔥";
    }

    if (stats.sleepHours >= 7) {
        return "Great job on your sleep schedule! Rest is the foundation of productivity 💪";
    }

    if (stats.habitsCompleted === stats.habitsTotal) {
        return "Perfect habit completion today! You're unstoppable ✨";
    }

    if (stats.journalWritten) {
        return "Your journal entries show real self-awareness. Keep reflecting 📝";
    }

    return motivationalMessages[Math.floor(Math.random() * motivationalMessages.length)];
};

export const getDefaultMessage = (): string => {
    return motivationalMessages[0];
};
