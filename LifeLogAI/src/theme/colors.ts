export const palette = {
    // Dark Bases
    darkBg: '#0f0f1a',
    darkCard: '#1a1a2e',
    darkCardHover: '#22223a',

    // Light Bases
    lightBg: '#f8fafc',
    lightCard: '#ffffff',
    lightCardHover: '#f1f5f9',

    // Shared
    white: '#ffffff',
    black: '#000000',
    gray100: '#f3f4f6',
    gray200: '#e5e7eb',
    gray300: '#d1d5db',
    gray400: '#9ca3af',
    gray500: '#6b7280',
    gray600: '#4b5563',
    gray700: '#374151',
    gray800: '#1f2937',
    gray900: '#111827',
} as const;

export const themes = {
    dark: {
        background: palette.darkBg,
        backgroundGradientStart: '#0f0f1a',
        backgroundGradientEnd: '#0a0a12',
        card: palette.darkCard,
        cardBorder: 'rgba(255,255,255,0.05)',
        text: palette.white,
        textMuted: palette.gray400,
        textSubtle: palette.gray600,
        icon: palette.white,
        tabBar: '#1a1a2e',
        activeTab: '#ffffff',
        inactiveTab: palette.gray500,
    },
    light: {
        background: palette.lightBg,
        backgroundGradientStart: '#f8fafc',
        backgroundGradientEnd: '#f1f5f9',
        card: palette.lightCard,
        cardBorder: 'rgba(0,0,0,0.05)',
        text: palette.gray900,
        textMuted: palette.gray500,
        textSubtle: palette.gray400,
        icon: palette.gray800,
        tabBar: '#ffffff',
        activeTab: palette.gray900,
        inactiveTab: palette.gray400,
    }
};

export const colors = {
    ...themes.dark,
    // Accent Colors (Shared)
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

export type ThemeType = 'light' | 'dark';
export type AccentColor = 'blue' | 'green' | 'orange' | 'purple';
