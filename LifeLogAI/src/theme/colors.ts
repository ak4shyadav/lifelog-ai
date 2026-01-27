export const colors = {
    // Backgrounds
    background: '#0f0f1a',
    backgroundGradientStart: '#0f0f1a',
    backgroundGradientEnd: '#0a0a12',
    card: '#1a1a2e',
    cardHover: '#22223a',

    // Text
    text: '#ffffff',
    textMuted: '#8888a0',
    textSubtle: '#5a5a7a',

    // Accent Colors
    blue: {
        primary: '#60a5fa',
        muted: '#3b82f6',
        bg: 'rgba(59, 130, 246, 0.15)',
        border: 'rgba(59, 130, 246, 0.3)',
    },
    green: {
        primary: '#34d399',
        muted: '#10b981',
        bg: 'rgba(16, 185, 129, 0.15)',
        border: 'rgba(16, 185, 129, 0.3)',
    },
    orange: {
        primary: '#fb923c',
        muted: '#f97316',
        bg: 'rgba(249, 115, 22, 0.15)',
        border: 'rgba(249, 115, 22, 0.3)',
    },
    purple: {
        primary: '#a78bfa',
        muted: '#8b5cf6',
        bg: 'rgba(139, 92, 246, 0.15)',
        border: 'rgba(139, 92, 246, 0.3)',
    },

    // AI Coach Gradient
    gradientStart: '#4f46e5',
    gradientMiddle: '#7c3aed',
    gradientEnd: '#db2777',
} as const;

export type AccentColor = 'blue' | 'green' | 'orange' | 'purple';
